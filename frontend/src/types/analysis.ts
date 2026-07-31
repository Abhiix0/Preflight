export type AnalysisStatus =
  "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface Analysis {
  job_id: string;
  status: AnalysisStatus;
  progress: number;
  current_step: string;
}

export interface AnalysisRequest {
  branch?: string;
  commit_sha?: string;
}

export interface AnalysisJobResponse {
  job_id: string;
  status: AnalysisStatus;
}
