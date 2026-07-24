"use client";

import { type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function StepCard({ step, title, description, icon: Icon }: StepCardProps) {
  return (
    <Card className="border-[var(--landing-surface)]/10 bg-[var(--landing-surface)]/[0.04] text-[var(--landing-fg)] backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--landing-surface)]/10 text-[var(--landing-surface)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-xs font-medium text-[var(--landing-fg-muted)]">
            {String(step).padStart(2, "0")}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-[var(--landing-fg-muted)]">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
