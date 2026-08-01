import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services";
import { useAuthStore } from "../store";

export const useCurrentUser = () => {
  const { setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    } else if (query.isError) {
      setUser(null);
    }
  }, [query.data, query.isError, setUser]);

  return query;
};

export const useAuth = () => {
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
      window.location.href = "/";
    },
  };
};
