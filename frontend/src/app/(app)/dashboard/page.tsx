"use client";

import { FolderGit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your repository readiness evaluations.
        </p>
      </div>

      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <CardHeader className="items-center pb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FolderGit2 className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4 text-xl">
            No repositories connected yet
          </CardTitle>
          <CardDescription>
            Connect a GitHub repository to run your first preflight engineering
            analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Connect Repository
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
