import { apiClient } from "../lib/api-client";
import { Analysis, AnalysisStatus, AnalysisRequest } from "../types";

export interface AnalysisJobsResponse {
  job_id: string;
  status: AnalysisStatus;
}

export const analysisService = {
  /**
   * POST /repositories/{repositoryId}/analysis
   */
  start: async (
    repositoryId: string,
    requestData?: AnalysisRequest
  ): Promise<AnalysisJobsResponse> => {
    const endpoint = `/repositories/${repositoryId}/analysis`;
    if (requestData) {
      return apiClient.post<AnalysisJobsResponse>(endpoint, requestData);
    }
    return apiClient.post<AnalysisJobsResponse>(endpoint);
  },

  /** GET /analysis/{jobId} */
  getStatus: async (jobId: string): Promise<Analysis> => {
    return apiClient.get<Analysis>(`/analysis/${jobId}`);
  },

  /** DELETE /analysis/{jobId} */
  cancel: async (jobId: string): Promise<void> => {
    return apiClient.delete<void>(`/analysis/${jobId}`);
  },

  /** GET /repositories/{repositoryId}/analysis */
  history: async (repositoryId: string): Promise<Analysis[]> => {
    return apiClient.get<Analysis[]>(`/repositories/${repositoryId}/analysis`);
  },
};
