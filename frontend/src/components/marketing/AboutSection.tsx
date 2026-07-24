export function AboutSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--landing-fg)] sm:text-4xl">
            Why Preflight?
          </h2>

          <div className="mt-8 space-y-5 text-[var(--landing-fg-muted)] leading-relaxed">
            <p>
              Every student developer deserves to build software with the
              confidence of a seasoned professional. But without years of
              experience, it&apos;s hard to know whether your project is
              truly ready for production — or where the hidden risks are.
            </p>
            <p>
              Preflight is an automated engineering-readiness platform that
              analyzes your codebase across security, architecture, DevOps,
              and dependency health. It distills complex best practices into
              clear, actionable findings — so you can focus on building, not
              second-guessing.
            </p>
            <p>
              Connect a repository, get a readiness report, fix what matters,
              and ship with confidence. That&apos;s it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
