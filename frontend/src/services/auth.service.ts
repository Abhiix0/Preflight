import { apiClient } from "../lib/api-client";
import { User } from "../types";

export const authService = {
  // GET /auth/github - redirects, so no direct call needed in service
  // GET /auth/github/callback - handled by route, not a service call

  // GET /users/me
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>("/users/me");
  },

  // POST /auth/logout
  logout: async (): Promise<void> => {
    // Clear token on frontend
    if (typeof window !== "undefined") {
      localStorage.removeItem("preflight_token");
    }
    return apiClient.get<void>("/auth/logout");
  },
};
