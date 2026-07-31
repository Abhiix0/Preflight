import { useQuery } from '@tanstack/react-query';
import { scoresService } from '../services';
import { Score } from '../types';

export const useScore = (jobId: string) => {
  return useQuery({
    queryKey: ['score', jobId],
    queryFn: () => scoresService.get(jobId),
    enabled: !!jobId,
  });
};

export const useScoreHistory = (repositoryId: string) => {
  return useQuery({
    queryKey: ['scores', repositoryId],
    queryFn: () => scoresService.history(repositoryId),
    enabled: !!repositoryId,
  });
};