import { apiClient } from "../lib/api-client";
import { Analysis, AnalysisStatus, AnalysisRequest } from "../types";

export interface AnalysisJobsResponse {
  job_id: string;
  status: AnalysisStatus;
}

export interface StartAnalysisOptions {
  requestData?: AnalysisRequest;
  idempotencyKey?: string;
}

export const analysisService = {
  /**
   * POST /repositories/{repositoryId}/analysis
   */
  start: async (
    repositoryId: string,
    options?: StartAnalysisOptions
  ): Promise<AnalysisJobsResponse> => {
    const endpoint = `/repositories/${repositoryId}/analysis`;
    const headers: Record<string, string> = {};
    if (options?.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }
    return apiClient.post<AnalysisJobsResponse>(endpoint, options?.requestData, {
      headers,
    });
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
