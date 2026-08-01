"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { apiClient } from "@/lib/api-client";
import type { User } from "@/types";

export default function AuthCallback() {
  const appRouter = useRouter();
  const { setUser, logout } = useAuthStore((state) => ({
    setUser: state.setUser,
    logout: state.logout,
  }));

  useEffect(() => {
    // This route is called by GitHub OAuth redirect after login
    // The backend should set the JWT in a cookie, and we'll fetch the user
    const fetchUser = async () => {
      try {
        const user = await apiClient.get<User>("/users/me");
        setUser(user);
        appRouter.push("/dashboard");
      } catch (error) {
        console.error("Auth callback failed:", error);
        logout();
        appRouter.replace("/login");
      }
    };

    fetchUser();
  }, [appRouter, setUser, logout]);

  return null;
}
