export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
