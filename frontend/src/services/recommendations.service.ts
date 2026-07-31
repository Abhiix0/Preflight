import { apiClient } from "../lib/api-client";
import { Recommendation } from "../types";

export const recommendationsService = {
  /** GET /analysis/{jobId}/recommendations */
  list: async (jobId: string): Promise<Recommendation[]> => {
    return apiClient.get<Recommendation[]>(
      `/analysis/${jobId}/recommendations`
    );
  },

  /** GET /recommendations/{recommendationId} */
  getById: async (recommendationId: string): Promise<Recommendation> => {
    return apiClient.get<Recommendation>(
      `/recommendations/${recommendationId}`
    );
  },
};
