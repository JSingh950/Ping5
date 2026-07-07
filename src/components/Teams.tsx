import { PartnerLogoGrid } from "./PartnerLogos";

const items = [
  {
    title: "Onboard your team",
    body: "Create a workspace, invite your reps with a single link, and connect your stack. A guided setup gets everyone live in minutes — no IT, no migration.",
  },
  {
    title: "Total visibility on warm leads",
    body: "See who on the team is pinging who, which prospects are warming up, and exactly where every relationship sits in the process — so no lead falls between reps.",
  },
  {
    title: "Integrate any tool",
    body: "Push the people you meet straight into the systems your team lives in. Connect once and the context flows where the work already happens.",
  },
];

export function Teams() {
  return (
    <section id="teams" className="relative px-4 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] p-8">
            <div className="absolute inset-x-0 top-0 h-48 bg-mint/15 blur-3xl" />
            <div className="relative rounded-[28px] border border-white/10 bg-black/75 p-5 shadow-2xl backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                    Team workspace
                  </p>
                  <h3 className="mt-2 text-2xl font-black">Warm lead map</h3>
                </div>
                <span className="rounded-full bg-mint px-3 py-1 text-xs font-black text-black">
                  Live
                </span>
              </div>
              <div className="relative h-80 rounded-[24px] bg-white/[0.04]">
                {[
                  ["Reece", "Founder", "left-[13%] top-[22%]"],
                  ["VC", "Seed fund", "left-[56%] top-[16%]"],
                  ["MIT", "Builder", "left-[68%] top-[55%]"],
                  ["Rep", "Owner", "left-[22%] top-[66%]"],
                  ["Lead", "Warm", "left-[42%] top-[40%]"],
                ].map(([name, role, pos]) => (
                  <div
                    key={name}
                    className={`absolute ${pos} rounded-2xl border border-white/10 bg-black/80 px-4 py-3 shadow-xl`}
                  >
                    <p className="text-sm font-bold">{name}</p>
                    <p className="text-xs text-mint">{role}</p>
                  </div>
                ))}
                <div className="absolute left-[27%] top-[33%] h-px w-[38%] rotate-[-10deg] bg-mint/40" />
                <div className="absolute left-[45%] top-[49%] h-px w-[28%] rotate-[22deg] bg-mint/40" />
                <div className="absolute left-[29%] top-[64%] h-px w-[28%] rotate-[-34deg] bg-mint/40" />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-mint">For teams</p>
            <h2 className="mt-5 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              One workspace for your whole team's network.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              Bring your sales team into a shared space where every connection a rep makes becomes a
              warm lead the whole team can see, own, and move forward, wired into the tools you
              already run on.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8"
            >
              <h3 className="mb-3 text-lg font-bold">{it.title}</h3>
              <p className="text-sm leading-6 text-white/60">{it.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-xs font-bold uppercase tracking-[0.25em] text-white/50">
          Integrates with
        </p>
        <div className="mt-8">
          <PartnerLogoGrid />
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#invest"
            className="rounded-full bg-mint px-8 py-3 text-sm font-black text-black shadow-[0_0_30px_-5px_var(--mint)] transition-transform hover:scale-105"
          >
            Set up your team
          </a>
        </div>
      </div>
    </section>
  );
}
