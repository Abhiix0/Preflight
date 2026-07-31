export type FindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface Finding {
  id: string;
  severity: FindingSeverity;
  title: string;
  description: string;
  fingerprint: string;
  recommendation: string;
  estimated_minutes: number;
}

export interface FindingFilters {
  severity?: string;
  category?: string;
  scanner?: string;
  file_path?: string;
  fingerprint?: string;
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
