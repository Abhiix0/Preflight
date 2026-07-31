import { useQuery } from "@tanstack/react-query";
import { authService } from "../services";
import { useAuthStore } from "../store";

export const useCurrentUser = () => {
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    onSuccess: (data) => setUser(data),
    onError: () => setUser(null),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAuth = () => {
  return {
    user: useAuthStore((state) => state.user),
    isAuthenticated: useAuthStore((state) => state.isAuthenticated),
    login: () => {
      // Redirect to GitHub OAuth - handled by Next.js router or auth service
      window.location.href = "/auth/github";
    },
    logout: () => {
      useAuthStore.getState().logout();
      window.location.href = "/";
    },
  };
};
