import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services";
import { useAuthStore } from "@/store";

export const useCurrentUser = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    } else if (query.isError) {
      logout();
    }
  }, [query.data, query.isError, setUser, logout]);

  return query;
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  return {
    user: useAuthStore((state) => state.user),
    isAuthenticated: useAuthStore((state) => state.isAuthenticated),
    login: () => {
      const backendBaseUrl = (
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"
      ).replace(/\/api\/v1\/?$/, "");
      window.location.href = `${backendBaseUrl}/auth/github`;
    },
    logout: async () => {
      await authService.logout();
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      window.location.href = "/login";
    },
  };
};
