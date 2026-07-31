import { apiClient } from "../lib/api-client";
import { Report } from "../types";

export const reportsService = {
  /** GET /analysis/{jobId}/report */
  get: async (jobId: string): Promise<Report> => {
    return apiClient.get<Report>(`/analysis/${jobId}/report`);
  },

  /** GET /repositories/{repositoryId}/reports */
  list: async (repositoryId: string): Promise<Report[]> => {
    return apiClient.get<Report[]>(`/repositories/${repositoryId}/reports`);
  },
};
