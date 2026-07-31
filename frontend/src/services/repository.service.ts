import { apiClient } from '../lib/api-client';
import { Repository } from '../types';

export interface ConnectRepositoryRequest {
  github_repo_id: number;
}

export const repositoryService = {
  // GET /repositories
  list: async (): Promise<Repository[]> => {
    return apiClient.get<Repository[]>('/repositories');
  },

  // POST /repositories
  connect: async (data: ConnectRepositoryRequest): Promise<Repository> => {
    return apiClient.post<Repository>('/repositories', data);
  },

  // GET /repositories/{repositoryId}
  getById: async (repositoryId: string): Promise<Repository> => {
    return apiClient.get<Repository>(`/repositories/${repositoryId}`);
  },

  // DELETE /repositories/{repositoryId}
  delete: async (repositoryId: string): Promise<void> => {
    return apiClient.delete<void>(`/repositories/${repositoryId}`);
  },
};