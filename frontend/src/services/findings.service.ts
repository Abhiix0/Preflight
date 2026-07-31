import { apiClient } from "../lib/api-client";
import { Finding, FindingFilters, PaginatedResponse } from "../types";

export const findingsService = {
  /** GET /analysis/{jobId}/findings */
  list: async (
    jobId: string,
    filters?: FindingFilters
  ): Promise<PaginatedResponse<Finding>> => {
    // Build query params from filters
    const params: Record<string, string> = {};
    if (filters) {
      if (filters.severity) params.severity = filters.severity;
      if (filters.category) params.category = filters.category;
      if (filters.scanner) params.scanner = filters.scanner;
      if (filters.file_path) params.file_path = filters.file_path;
      if (filters.fingerprint) params.fingerprint = filters.fingerprint;
      if (filters.q) params.q = filters.q;
      if (filters.page !== undefined) params.page = String(filters.page);
      if (filters.limit !== undefined) params.limit = String(filters.limit);
      if (filters.sort) params.sort = filters.sort;
      if (filters.order) params.order = filters.order;
    }
    return apiClient.get<PaginatedResponse<Finding>>(
      `/analysis/${jobId}/findings`,
      params
    );
  },

  /** GET /findings/{findingId} */
  getById: async (findingId: string): Promise<Finding> => {
    return apiClient.get<Finding>(`/findings/${findingId}`);
  },
};
