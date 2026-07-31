import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repositoryService, ConnectRepositoryRequest } from '../services';
import { Repository } from '../types';

export const useRepositories = () => {
  return useQuery({
    queryKey: ['repositories'],
    queryFn: repositoryService.list,
  });
};

export const useConnectRepository = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConnectRepositoryRequest) => repositoryService.connect(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    },
  });
};

export const useDeleteRepository = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (repositoryId: string) => repositoryService.delete(repositoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    },
  });
};

export const useRepositoryDetails = (repositoryId: string) => {
  return useQuery({
    queryKey: ['repository', repositoryId],
    queryFn: () => repositoryService.getById(repositoryId),
    enabled: !!repositoryId,
  });
};