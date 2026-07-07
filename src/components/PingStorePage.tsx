import { useMemo, useState } from "react";

type Variant = "matrix" | "lookbook" | "blueprint" | "fluid";

type PingStorePageProps = {
  variant: Variant;
};

const finishes = [
  {
    name: "Signal Black",
    tone: "bg-neutral-950",
    detail: "black titanium / mirror edge",
  },
  {
    name: "Raw Titanium",
    tone: "bg-zinc-300",
    detail: "brushed silver / 2mm profile",
  },
  {
    name: "Circuit Green",
    tone: "bg-[#00FF66]",
    detail: "limited electric accent",
  },
];

const whyNow = [
  {
    title: "Real connection is rare again",
    body: "After years of digital-first interaction and AI-generated noise, people want physical moments that feel human at conferences, coworking spaces, clubs, and campuses.",
  },
  {
    title: "Business cards are functionally dead",
    body: "More than 27 billion paper business cards are printed globally every year, and 88% are thrown away within a week. Ping! turns the exchange into a tap that cannot be lost in a pocket.",
  },
  {
    title: "NFC is already native",
    body: "Modern iPhone and Android devices read NFC without a scanning app. A single tap can open contacts, socials, portfolios, links, and the digital trail you choose to share.",
  },
];

const specs = [
  {
    eyebrow: "STRUCTURE",
    title: "2.5g titanium, built like jewelry.",
    body: "An ultra-lightweight titanium smart ring with a thin 2mm profile, designed for identity and connection rather than health tracking.",
    stat: "2.5g",
  },
  {
    eyebrow: "POWER",
    title: "Zero-charging footprint.",
    body: "Ping! uses built-in NFC, so the everyday exchange feels instant and native with no battery ritual added to your life.",
    stat: "0x",
  },
  {
    eyebrow: "REACH",
    title: "Every tap is a live product demo.",
    body: "Early cohorts scaled beyond 270 active rings, with each in-person tap showing the product to someone new in the wild.",
    stat: "270+",
  },
];

const team = [
  {
    name: "Vaness “Reece” Gardner",
    role: "Founder & CEO",
    body: "Former AI specialist at Babson College and Babson alum. Founded The Generator, an AI lab that grew past 1,000 members across the Boston technology landscape, including MIT, Harvard, researchers, venture partners, students, and local business owners.",
    focus: "Strategic vision, wearable design, supply chain logistics, institutional sales, ecosystem relationships.",
  },
  {
    name: "Gaspard Seuge",
    role: "Co-Founder & CPO",
    body: "HEC Paris educated product architect. Former Growth at MWM AI and AI Engineer at Sorare, the multi-billion-dollar fantasy sports web3 platform. Built the Ping! web and iOS apps and helped drive 300K+ organic impressions.",
    focus: "Software product, brand systems, UX, mobile and web applications, go-to-market strategy.",
  },
];

const variants = {
  matrix: {
    label: "The Cinematic Matrix",
    bg: "bg-black",
    page: "font-sans tracking-tight",
    nav: "border-[#00FF66]/35 bg-black/85 text-white",
    heroGrid: "border-[#00FF66]/40",
    media: "border-[#00FF66]/40 bg-black",
    panel: "border-[#00FF66]/50 bg-black",
    title: "text-5xl font-black uppercase leading-[0.86] text-white md:text-7xl lg:text-8xl",
    subtitle: "text-lg font-semibold uppercase text-white md:text-xl",
    copy: "text-sm leading-6 text-zinc-400",
    accent: "text-[#00FF66]",
    button: "border border-[#00FF66] bg-[#00FF66] px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-black transition hover:bg-black hover:text-[#00FF66]",
    secondaryButton: "border border-[#00FF66]/60 px-5 py-4 text-xs font-bold uppercase tracking-[0.22em] text-[#00FF66]",
    section: "border-t border-[#00FF66]/35",
    card: "border border-[#00FF66]/35 bg-black",
    serif: "",
    mono: "font-mono",
    round: "rounded-none",
    ringGlow: "shadow-[0_0_70px_rgba(0,255,102,0.24)]",
  },
  lookbook: {
    label: "The High-End Technical Lookbook",
    bg: "bg-black",
    page: "font-sans tracking-tight",
    nav: "border-white/10 bg-black/75 text-white",
    heroGrid: "border-white/10",
    media: "border-white/10 bg-black",
    panel: "border-white/10 bg-black",
    title: "font-serif text-5xl leading-[0.95] text-white md:text-7xl lg:text-8xl",
    subtitle: "font-serif text-2xl leading-tight text-white md:text-4xl",
    copy: "text-sm leading-7 text-zinc-400",
    accent: "text-[#00C853]",
    button: "border border-white bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:border-[#00C853] hover:bg-[#00C853]",
    secondaryButton: "px-0 py-4 text-xs uppercase tracking-[0.24em] text-[#00C853]",
    section: "border-t border-white/10",
    card: "border-0 bg-transparent",
    serif: "font-serif",
    mono: "font-mono",
    round: "rounded-none",
    ringGlow: "",
  },
  blueprint: {
    label: "The Functional Blueprint Grid",
    bg: "bg-black",
    page: "font-mono tracking-tight",
    nav: "border-[#00FF66]/45 bg-black text-white",
    heroGrid: "border-[#00FF66]/45",
    media: "border-[#00FF66]/45 bg-black",
    panel: "border-[#00FF66]/45 bg-black",
    title: "text-4xl font-bold uppercase leading-[0.92] text-white md:text-6xl lg:text-7xl",
    subtitle: "text-lg font-bold uppercase text-white md:text-2xl",
    copy: "text-xs leading-6 text-zinc-400",
    accent: "text-[#00FF66]",
    button: "border border-[#00FF66] bg-[#00FF66] px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-[#00FF66]",
    secondaryButton: "border border-zinc-700 px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white",
    section: "border-t border-[#00FF66]/45",
    card: "border border-zinc-700 bg-black",
    serif: "",
    mono: "font-mono",
    round: "rounded-none",
    ringGlow: "shadow-[0_0_0_1px_rgba(0,255,102,0.5)]",
  },
  fluid: {
    label: "The Fluid Motion Darkmode",
    bg: "bg-black",
    page: "font-sans tracking-tight",
    nav: "border-white/10 bg-black/75 text-white backdrop-blur-xl",
    heroGrid: "border-white/10",
    media: "border-white/10 bg-zinc-950/70",
    panel: "border-white/10 bg-zinc-950/65 backdrop-blur-xl",
    title: "text-5xl font-semibold leading-[0.92] text-white md:text-7xl lg:text-8xl",
    subtitle: "text-xl font-medium leading-tight text-zinc-100 md:text-3xl",
    copy: "text-sm leading-7 text-zinc-400",
    accent: "text-[#00FF66]",
    button: "rounded-full bg-[#00FF66] px-7 py-4 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-white",
    secondaryButton: "rounded-full border border-white/15 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white",
    section: "border-t border-white/10",
    card: "rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur",
    serif: "",
    mono: "font-mono",
    round: "rounded-[2rem]",
    ringGlow: "shadow-[0_0_100px_rgba(0,255,102,0.2)]",
  },
} satisfies Record<Variant, Record<string, string>>;

function RingVisual({
  variant,
  tone,
  label,
  large = false,
}: {
  variant: Variant;
  tone: string;
  label: string;
  large?: boolean;
}) {
  const v = variants[variant];
  const isFluid = variant === "fluid";
  const isBlueprint = variant === "blueprint";

  return (
    <div className={`relative isolate flex min-h-[22rem] items-center justify-center overflow-hidden ${v.media} ${v.round}`}>
      {isFluid ? (
        <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle_at_45%_42%,rgba(0,255,102,0.36),transparent_44%),radial-gradient(circle_at_60%_70%,rgba(0,200,83,0.22),transparent_42%)] blur-2xl" />
      ) : null}
      {isBlueprint ? (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,.12)_1px,transparent_1px)] bg-[size:34px_34px]" />
      ) : null}
      <div
        className={`relative aspect-square ${large ? "w-56 md:w-72" : "w-44 md:w-56"} rounded-full border-[18px] md:border-[24px] ${tone} border-current text-zinc-200 ${v.ringGlow}`}
      >
        <div className="absolute inset-[22%] rounded-full bg-black" />
        <div className="absolute left-1/2 top-[-16%] h-10 w-[2px] -translate-x-1/2 bg-[#00FF66]" />
        <div className="absolute bottom-[-2.75rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
          <p className={`text-[10px] uppercase tracking-[0.28em] ${v.accent}`}>{label}</p>
        </div>
      </div>
    </div>
  );
}

export function PingStorePage({ variant }: PingStorePageProps) {
  const [finish, setFinish] = useState(finishes[0]);
  const [openWhy, setOpenWhy] = useState(0);
  const [activeSpec, setActiveSpec] = useState(0);
  const v = variants[variant];

  const heroTagline = useMemo(() => {
    if (variant === "lookbook") return "A titanium object for the return of real-world identity.";
    if (variant === "blueprint") return "[OBJECT: NFC IDENTITY RING] engineered for physical-to-digital connection.";
    if (variant === "fluid") return "Tap into the person in front of you, then carry the connection forward.";
    return "The NFC identity ring for a world tired of cold digital noise.";
  }, [variant]);

  return (
    <main className={`${v.bg} ${v.page} min-h-screen text-white`}>
      <header className={`sticky top-0 z-50 flex items-center justify-between border-b px-5 py-4 md:px-8 ${v.nav}`}>
        <a href="#top" className="text-sm font-bold uppercase tracking-[0.28em]">
          Ping!
        </a>
        <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.24em] text-zinc-400 md:flex">
          <a className="transition hover:text-[#00FF66]" href="#why">Why now</a>
          <a className="transition hover:text-[#00FF66]" href="#specs">Specs</a>
          <a className="transition hover:text-[#00FF66]" href="#team">Team</a>
        </nav>
        <a className={variant === "fluid" ? "rounded-full bg-white px-4 py-2 text-xs font-bold text-black" : `text-xs uppercase tracking-[0.22em] ${v.accent}`} href="#buy">
          Get Ping!
        </a>
      </header>

      <section id="top" className={`grid min-h-screen border-b lg:grid-cols-[minmax(0,1.12fr)_minmax(25rem,0.88fr)] ${v.heroGrid}`}>
        <div className="grid gap-px bg-white/10 p-px lg:grid-cols-2">
          <div className="lg:col-span-2">
            <RingVisual variant={variant} tone={finish.tone} label={finish.name} large />
          </div>
          {finishes.map((item) => (
            <button
              key={item.name}
              className="text-left"
              onClick={() => setFinish(item)}
              type="button"
            >
              <RingVisual variant={variant} tone={item.tone} label={item.name} />
            </button>
          ))}
        </div>

        <aside className={`lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] ${v.panel}`} id="buy">
          <div className="flex h-full flex-col justify-between gap-10 p-6 md:p-10">
            <div>
              <div className={`mb-8 flex items-center justify-between border-b pb-5 ${variant === "matrix" || variant === "blueprint" ? "border-[#00FF66]/35" : "border-white/10"}`}>
                <span className={`text-[11px] uppercase tracking-[0.28em] ${v.accent}`}>{v.label}</span>
                <span className={`text-[11px] uppercase tracking-[0.28em] ${variant === "blueprint" ? "text-[#00FF66]" : "text-zinc-500"}`}>NFC / 2.5g</span>
              </div>
              <p className={`mb-3 text-sm uppercase tracking-[0.3em] ${v.accent}`}>Ping! by Ping Ring Inc.</p>
              <h1 className={v.title}>Ping!</h1>
              <p className={`mt-7 max-w-xl ${v.subtitle}`}>{heroTagline}</p>
              <p className={`mt-5 max-w-xl ${v.copy}`}>
                A smart ring designed purely for identity, portfolios, and bridging in-person connection to your digital trail. It is not a health tracker.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className={`text-xs uppercase tracking-[0.24em] ${v.accent}`}>Select finish</p>
                  <p className="text-xs text-zinc-500">{finish.detail}</p>
                </div>
                <div className="grid gap-3">
                  {finishes.map((item) => (
                    <button
                      className={`flex items-center justify-between border px-4 py-4 text-left transition ${
                        finish.name === item.name
                          ? "border-[#00FF66] text-white"
                          : "border-white/12 text-zinc-400 hover:border-[#00FF66]/60 hover:text-white"
                      } ${variant === "fluid" ? "rounded-full" : "rounded-none"}`}
                      key={item.name}
                      onClick={() => setFinish(item)}
                      type="button"
                    >
                      <span className="text-sm font-semibold">{item.name}</span>
                      <span className={`h-4 w-4 rounded-full border border-white/30 ${item.tone}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className={`grid grid-cols-3 border text-center ${variant === "matrix" || variant === "blueprint" ? "border-[#00FF66]/35" : "border-white/10"} ${variant === "fluid" ? "rounded-[1.5rem] overflow-hidden" : ""}`}>
                {["2.5g titanium", "native NFC", "no scan app"].map((item) => (
                  <div className="border-r border-inherit px-3 py-4 last:border-r-0" key={item}>
                    <p className={`text-[10px] uppercase tracking-[0.18em] ${variant === "blueprint" ? "text-[#00FF66]" : "text-zinc-400"}`}>{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a className={`${v.button} text-center`} href="mailto:hello@getping.today?subject=Get%20Ping!">
                  Get Ping!
                </a>
                <a className={`${v.secondaryButton} text-center`} href="#why">
                  Why now
                </a>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section id="why" className={`px-5 py-20 md:px-8 lg:py-28 ${v.section}`}>
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1fr]">
          <div>
            <p className={`mb-4 text-xs uppercase tracking-[0.28em] ${v.accent}`}>Why now</p>
            <h2 className={variant === "lookbook" ? `${v.serif} text-5xl leading-tight md:text-7xl` : "text-4xl font-bold uppercase leading-tight md:text-6xl"}>
              The moment for a physical digital identity key.
            </h2>
          </div>
          <div className={`divide-y ${variant === "matrix" || variant === "blueprint" ? "divide-[#00FF66]/35" : "divide-white/10"}`}>
            {whyNow.map((item, index) => (
              <div key={item.title}>
                <button
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                  onClick={() => setOpenWhy(openWhy === index ? -1 : index)}
                  type="button"
                >
                  <span className="text-xl font-semibold text-white md:text-2xl">{item.title}</span>
                  <span className={`text-3xl leading-none ${v.accent}`}>{openWhy === index ? "-" : "+"}</span>
                </button>
                <div className={`grid transition-all duration-500 ${openWhy === index ? "grid-rows-[1fr] pb-8" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className={`max-w-3xl ${v.copy}`}>{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="specs" className={`min-h-screen px-5 py-20 md:px-8 lg:py-28 ${v.section}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className={`mb-4 text-xs uppercase tracking-[0.28em] ${v.accent}`}>Macro specification carousel</p>
              <h2 className={variant === "lookbook" ? `${v.serif} text-5xl leading-tight md:text-7xl` : "text-4xl font-bold uppercase leading-tight md:text-6xl"}>
                Hardware with nothing extra.
              </h2>
            </div>
            <div className="flex gap-2">
              {specs.map((item, index) => (
                <button
                  aria-label={`Show ${item.eyebrow}`}
                  className={`h-2.5 w-10 transition ${activeSpec === index ? "bg-[#00FF66]" : "bg-white/20"}`}
                  key={item.eyebrow}
                  onClick={() => setActiveSpec(index)}
                  type="button"
                />
              ))}
            </div>
          </div>

          <div className={`grid min-h-[34rem] overflow-hidden ${v.card} ${variant === "fluid" ? "lg:grid-cols-[0.9fr_1.1fr]" : "lg:grid-cols-2"}`}>
            <div className="relative flex items-center justify-center overflow-hidden border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
              {variant === "fluid" ? <div className="absolute h-96 w-96 rounded-full bg-[#00FF66]/20 blur-3xl" /> : null}
              {variant === "blueprint" ? <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:50px_50px]" /> : null}
              <div className={`relative flex aspect-square w-64 items-center justify-center rounded-full border ${variant === "fluid" ? "border-[#00FF66]/35 bg-black/60" : "border-[#00FF66]/60"}`}>
                <span className={`${v.accent} ${variant === "lookbook" ? "font-serif text-8xl" : "text-7xl font-black"}`}>{specs[activeSpec].stat}</span>
              </div>
            </div>
            <div className="flex flex-col justify-between p-8 md:p-12">
              <div>
                <p className={`mb-6 text-xs uppercase tracking-[0.28em] ${v.accent}`}>
                  {variant === "blueprint" ? `[STATUS: ${specs[activeSpec].eyebrow}]` : specs[activeSpec].eyebrow}
                </p>
                <h3 className={variant === "lookbook" ? `${v.serif} text-5xl leading-tight text-white md:text-7xl` : "text-4xl font-bold uppercase leading-tight text-white md:text-6xl"}>
                  {specs[activeSpec].title}
                </h3>
                <p className={`mt-8 max-w-xl ${v.copy}`}>{specs[activeSpec].body}</p>
              </div>
              <div className="mt-12 grid gap-3 md:grid-cols-3">
                {specs.map((item, index) => (
                  <button
                    className={`border p-4 text-left transition ${activeSpec === index ? "border-[#00FF66] text-white" : "border-white/10 text-zinc-500 hover:text-white"}`}
                    key={item.eyebrow}
                    onClick={() => setActiveSpec(index)}
                    type="button"
                  >
                    <p className={`text-[10px] uppercase tracking-[0.2em] ${activeSpec === index ? v.accent : ""}`}>{item.eyebrow}</p>
                    <p className="mt-2 text-sm">{item.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className={`px-5 py-20 md:px-8 lg:py-28 ${v.section}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className={`mb-4 text-xs uppercase tracking-[0.28em] ${v.accent}`}>Creator / team pedigree</p>
            <h2 className={variant === "lookbook" ? `${v.serif} text-5xl leading-tight md:text-7xl` : "text-4xl font-bold uppercase leading-tight md:text-6xl"}>
              Built by AI-native product operators.
            </h2>
          </div>
          <div className={`grid ${variant === "lookbook" ? "gap-12 lg:grid-cols-2" : "gap-px bg-white/10 lg:grid-cols-2"}`}>
            {team.map((person) => (
              <article className={`${variant === "lookbook" ? "border-t border-white/10 pt-8" : `${v.card} p-8 md:p-10`}`} key={person.name}>
                <p className={`mb-5 text-xs uppercase tracking-[0.28em] ${v.accent}`}>{person.role}</p>
                <h3 className={variant === "lookbook" ? `${v.serif} text-4xl leading-tight text-white md:text-6xl` : "text-3xl font-bold uppercase leading-tight text-white md:text-5xl"}>
                  {person.name}
                </h3>
                <p className={`mt-7 ${v.copy}`}>{person.body}</p>
                <div className={`mt-8 border-t pt-6 ${variant === "matrix" || variant === "blueprint" ? "border-[#00FF66]/35" : "border-white/10"}`}>
                  <p className={`mb-2 text-[10px] uppercase tracking-[0.24em] ${v.accent}`}>Focus</p>
                  <p className="text-sm leading-6 text-zinc-300">{person.focus}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className={`px-5 py-10 md:px-8 ${v.section}`}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs uppercase tracking-[0.22em] text-zinc-500 md:flex-row">
          <p>Ping! by Ping Ring Inc.</p>
          <p>Identity. Portfolios. Real-world connection.</p>
        </div>
      </footer>
    </main>
  );
}
