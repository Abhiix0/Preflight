/** Validate GitHub repository ID */
export const validateGitHubRepoId = (id: unknown): id is number => {
  if (typeof id !== 'number') return false;
  return id > 0 && Number.isInteger(id);
};

/** Validate repository name */
export const validateRepositoryName = (name: unknown): name is string => {
  if (typeof name !== 'string') return false;
  return /^[a-zA-Z0-9_-]+$/.test(name);
};

/** Validate analysis job ID */
export const validateJobId = (id: unknown): id is string => {
  if (typeof id !== 'string') return false;
  return id.length > 0;
};

/** Validate finding severity */
export const validateSeverity = (severity: unknown): severity is string => {
  const validSeverities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
  if (typeof severity !== 'string') return false;
  return validSeverities.includes(severity);
};

/** Validate score range */
export const validateScore = (score: unknown): score is number => {
  if (typeof score !== 'number') return false;
  return score >= 0 && score <= 100;
};

/** Validate pagination params */
export const validatePaginationParams = (
  page: unknown,
  limit: unknown
): { page: number; limit: number } | null => {
  const p = typeof page === 'number' ? page : typeof page === 'string' ? parseInt(page) : 1;
  const l = typeof limit === 'number' ? limit : typeof limit === 'string' ? parseInt(limit) : 20;

  if (isNaN(p) || p < 1) return null;
  if (isNaN(l) || l < 1 || l > 100) return null;

  return { page: p, limit: l };
};