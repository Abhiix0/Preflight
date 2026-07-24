"use client";

import { GitBranch, Search, FileText, Rocket } from "lucide-react";
import { StepCard } from "@/components/marketing/StepCard";

const steps = [
  {
    title: "Connect Repository",
    description:
      "Link your GitHub repository in one click. Preflight pulls your code, config, and CI setup automatically.",
    icon: GitBranch,
  },
  {
    title: "Analyze",
    description:
      "Automated analyzers scan for security gaps, architecture issues, dependency risks, and DevOps best practices.",
    icon: Search,
  },
  {
    title: "Review Report",
    description:
      "Get a clear, prioritized report with actionable findings and a production-readiness score.",
    icon: FileText,
  },
  {
    title: "Deploy with Confidence",
    description:
      "Fix what matters, re-run the check, and ship knowing your project meets professional engineering standards.",
    icon: Rocket,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--landing-fg)] sm:text-4xl">
          How It Works
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--landing-fg-muted)]">
          Four steps from repository to production-ready.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <StepCard
              key={step.title}
              step={i + 1}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
