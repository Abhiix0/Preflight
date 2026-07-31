import { useQuery } from "@tanstack/react-query";
import { findingsService } from "../services";
import { FindingFilters } from "../types";

export const useFindings = (jobId: string, filters?: FindingFilters) => {
  return useQuery({
    queryKey: ["findings", jobId, filters],
    queryFn: () => findingsService.list(jobId, filters),
    enabled: !!jobId,
  });
};

export const useFindingDetails = (findingId: string) => {
  return useQuery({
    queryKey: ["finding", findingId],
    queryFn: () => findingsService.getById(findingId),
    enabled: !!findingId,
  });
};
