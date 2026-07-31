"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to Preflight
          </h1>
          <p className="text-muted-foreground">
            Connect your repositories to start analyzing code quality and security
          </p>
        </div>

        <Button
          className="w-full"
          variant="default"
          size="lg"
          onClick={handleLogin}
        >
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}