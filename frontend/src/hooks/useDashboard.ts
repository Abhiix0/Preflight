import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getSummary,
    staleTime: 30 * 1000, // 30 seconds
  });
};
