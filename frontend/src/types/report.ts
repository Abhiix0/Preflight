export interface Report {
  id: string;
  job_id: string;
  content: Record<string, unknown>; // Shape depends on report type, typically a structured JSON for the viewer
  created_at: string;
}
