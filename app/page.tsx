const focusAreas = [
  "Intervention evidence",
  "Conflict prevention",
  "Policy translation",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#17231f]">
      <section className="relative overflow-hidden border-b border-[#d8d2c3] bg-[#f7f5ef]">
        <div className="mx-auto grid min-h-[88vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-[#b9c7bd] bg-white/70 px-4 py-2 text-sm font-medium text-[#315246]">
              Structured evidence for peacebuilding decisions
            </p>
            <h1 className="text-5xl font-semibold leading-[1.03] tracking-normal text-[#13231f] sm:text-6xl lg:text-7xl">
              Evidence for Violence De-escalation and Action (EVIDA)
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#52615b] sm:text-xl">
              A structured evidence-mapping platform helping practitioners,
              funders, and policymakers understand what works in reducing armed
              conflict.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#cta"
                className="inline-flex items-center justify-center rounded-md bg-[#1f5f4b] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#174d3d]"
              >
                Explore the Platform
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-md border border-[#9aa99e] bg-white/70 px-6 py-3 text-base font-semibold text-[#1f3f35] transition hover:bg-white"
              >
                Learn About EVIDA
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-[#d0c8b8] bg-white p-5 shadow-[0_24px_70px_rgba(23,35,31,0.12)]">
            <div className="border-b border-[#e4dfd3] pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d7b74]">
                Evidence Map
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#17231f]">
                Comparing approaches across conflict settings
              </h2>
            </div>
            <div className="mt-6 space-y-4">
              {focusAreas.map((area, index) => (
                <div
                  key={area}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md border border-[#e2ded4] bg-[#fbfaf6] p-4"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#dfe9e3] text-sm font-bold text-[#1f5f4b]">
                    0{index + 1}
                  </span>
                  <span className="font-medium text-[#26352f]">{area}</span>
                  <span className="h-2 w-20 rounded-full bg-[#d7a94b]" />
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#e4dfd3] pt-5 text-center">
              <div>
                <p className="text-2xl font-semibold text-[#1f5f4b]">120+</p>
                <p className="text-xs font-medium uppercase tracking-wide text-[#69776f]">
                  Studies
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#1f5f4b]">32</p>
                <p className="text-xs font-medium uppercase tracking-wide text-[#69776f]">
                  Countries
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#1f5f4b]">18</p>
                <p className="text-xs font-medium uppercase tracking-wide text-[#69776f]">
                  Measures
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-white px-6 py-20 sm:px-10 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b2812d]">
              About EVIDA
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#17231f]">
              Turning scattered research into practical evidence.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-8 text-[#53615c]">
            <p>
              EVIDA helps teams make sense of complex conflict-reduction
              evidence by organizing research, interventions, outcomes, and
              implementation contexts in one structured platform.
            </p>
            <p>
              Built for applied decision-making, it supports clearer comparison
              across programs, sharper learning agendas, and more transparent
              funding and policy choices.
            </p>
          </div>
        </div>
      </section>

      <section id="cta" className="bg-[#17372f] px-6 py-20 text-white sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7a94b]">
              Call to Action
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Build better violence reduction strategies with evidence at hand.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#dbe6e1]">
              Partner with EVIDA to map what is known, identify knowledge gaps,
              and move from research insight to informed action.
            </p>
          </div>
          <a
            href="mailto:hello@evida.org"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#d7a94b] px-6 py-3 text-base font-semibold text-[#13231f] transition hover:bg-[#e3bc67]"
          >
            Start a Conversation
          </a>
        </div>
      </section>
    </main>
  );
}
