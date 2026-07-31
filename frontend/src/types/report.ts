export interface Report {
  id: string;
  job_id: string;
  content: any; // Shape depends on report type, typically a structured JSON for the viewer
  created_at: string;
}
