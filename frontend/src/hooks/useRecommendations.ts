import { useQuery } from '@tanstack/react-query';
import { recommendationsService } from '../services';
import { Recommendation } from '../types';

export const useRecommendations = (jobId: string) => {
  return useQuery({
    queryKey: ['recommendations', jobId],
    queryFn: () => recommendationsService.list(jobId),
    enabled: !!jobId,
  });
};

export const useRecommendationDetails = (recommendationId: string) => {
  return useQuery({
    queryKey: ['recommendation', recommendationId],
    queryFn: () => recommendationsService.getById(recommendationId),
    enabled: !!recommendationId,
  });
};