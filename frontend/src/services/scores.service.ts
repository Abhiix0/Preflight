import { apiClient } from '../lib/api-client';
import { Score } from '../types';

export const scoresService = {
  /** GET /analysis/{jobId}/score */
  get: async (jobId: string): Promise<Score> => {
    return apiClient.get<Score>(`/analysis/${jobId}/score`);
  },

  /** GET /repositories/{repositoryId}/scores */
  history: async (repositoryId: string): Promise<Score[]> => {
    return apiClient.get<Score[]>(`/repositories/${repositoryId}/scores`);
  },
};