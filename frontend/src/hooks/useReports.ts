import { useQuery } from "@tanstack/react-query";
import { reportsService } from "@/services";

export const useReport = (jobId: string) => {
  return useQuery({
    queryKey: ["report", jobId],
    queryFn: () => reportsService.get(jobId),
    enabled: !!jobId,
  });
};

export const useRepositoryReports = (repositoryId: string) => {
  return useQuery({
    queryKey: ["reports", repositoryId],
    queryFn: () => reportsService.list(repositoryId),
    enabled: !!repositoryId,
  });
};
