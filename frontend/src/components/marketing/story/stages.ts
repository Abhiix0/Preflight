export type StoryStage = {
  id: string;
  label: string;
  title: string;
  description: string;
};

export const STORY_STAGES: StoryStage[] = [
  {
    id: "idea",
    label: "01 / Idea",
    title: "Paper Airplane",
    description:
      "Every great project starts as a simple idea. But as your codebase grows, so does the complexity and the risk of hidden structural issues.",
  },
  {
    id: "development",
    label: "02 / Development",
    title: "Wireframe Aircraft",
    description:
      "You build the components and wire up the logic. Preflight continuously analyzes your architecture and dependencies, catching flaws before they get deeply ingrained.",
  },
  {
    id: "production",
    label: "03 / Production",
    title: "Jet",
    description:
      "Getting ready to launch. We run a comprehensive security audit and DevOps readiness check, giving you a prioritized report of what matters most.",
  },
  {
    id: "deployment",
    label: "04 / Deployment",
    title: "Rocket",
    description:
      "Lift off. Fix the critical gaps, re-run your checks, and deploy with the absolute confidence of a seasoned professional engineer.",
  },
];
