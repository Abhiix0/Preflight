import { apiClient } from "../lib/api-client";
import { DashboardSummary } from "../types";

export const dashboardService = {
  /** GET /dashboard */
  getSummary: async (): Promise<DashboardSummary> => {
    return apiClient.get<DashboardSummary>("/dashboard");
  },
};
