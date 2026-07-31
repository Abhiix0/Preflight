import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisService } from '../services';
import { AnalysisRequest } from '../types';

export const useStartAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { repositoryId: string; requestData?: AnalysisRequest }) =>
      analysisService.start(params.repositoryId, params.requestData),
    onSuccess: (_, { repositoryId }) => {
      queryClient.invalidateQueries({ queryKey: ['analysis', repositoryId] });
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    },
  });
};

export const useAnalysisStatus = (jobId: string) => {
  return useQuery({
    queryKey: ['analysis', jobId],
    queryFn: () => analysisService.getStatus(jobId),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.status === 'RUNNING') return 2000;
      return false;
    },
  });
};

export const useCancelAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => analysisService.cancel(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['analysis', jobId] });
    },
  });
};

export const useAnalysisHistory = (repositoryId: string) => {
  return useQuery({
    queryKey: ['analysis-history', repositoryId],
    queryFn: () => analysisService.history(repositoryId),
    enabled: !!repositoryId,
  });
};