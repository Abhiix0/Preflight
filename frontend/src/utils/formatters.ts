/** Format score as percentage */
export const formatScore = (score: number): string => {
  return `${Math.round(score)}%`;
};

/** Format minutes to human readable */
export const formatMinutes = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/** Format date for display */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

/** Format severity badge color */
export const getSeverityColor = (severity: string): string => {
  const map: Record<string, string> = {
    CRITICAL: "bg-red-500 text-white",
    HIGH: "bg-orange-500 text-white",
    MEDIUM: "bg-amber-500 text-white",
    LOW: "bg-blue-500 text-white",
    INFO: "bg-slate-500 text-white",
  };
  return map[severity] || "bg-slate-500 text-white";
};

/** Format category badge */
export const formatCategory = (category: string): string => {
  return category.replace(/_/g, " ");
};
