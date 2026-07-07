import { BadgeDollarSign, Fingerprint, Network, Sparkles, Users } from "lucide-react";

const whyNow = [
  {
    title: "The craving for real human connection",
    body: "After years of Zoom and AI-mediated feeds, people are actively choosing in-person again: conferences, coworking, run clubs, supper clubs, and creator meetups. Ping! bridges the in-person moment to the digital trail.",
  },
  {
    title: "NFC finally works everywhere",
    body: "Every iPhone and Android shipping today reads NFC tags natively. The infrastructure for tap-to-share is here now.",
  },
  {
    title: "Business cards are dying",
    body: "Nobody under 30 carries them. Remote work, sustainability, and digital identity killed the old habit, but nothing desirable has fully replaced it.",
  },
  {
    title: "Smart rings are mainstream",
    body: "Oura, RingConn, and others made connected rings a real category, and the wearable market passed $80B in 2025. Ping! rides that wave for identity and connection, not health data.",
  },
];

const team = [
  {
    name: 'Vaness "Reece" Gardner',
    role: "Founder & CEO",
    body: "Repeat founder operating at the intersection of AI and entrepreneurship. Ping! was born from his AI creative practice at Babson College, where he pioneered text-to-image-3D workflows and took the ring from rendered concept to real product in under a year. He founded The Generator, Babson's interdisciplinary AI lab, which has drawn 1,000+ people from the Boston AI ecosystem, including SMB owners, VCs, industry partners, and students from MIT, Harvard, Northeastern, and other institutions. Reece leads strategic vision, fundraising, supply chain, sales, and external relationships, and has represented Ping! across SXSW and conversations with leading early-stage funds. Babson College alumni.",
  },
  {
    name: "Gaspard Seuge",
    role: "Co-Founder & CPO",
    body: "Serial entrepreneur and product builder. Previously Growth at MWM AI and AI Engineer at Sorare, a $4B+ fantasy sports platform. Educated at HEC Paris. Gaspard joined Ping! in November 2025, helped build the brand and GTM motion to 300K+ organic impressions in under two months, then transitioned to CPO to build the web app and iOS app. He leads product, brand, marketing, GTM, financials, and fundraising.",
  },
];

export function About() {
  return (
    <section id="about" className="relative px-4 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-mint">
              <Sparkles className="h-3.5 w-3.5" /> Our mission
            </span>
            <h2 className="mt-8 text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Built to enhance human connection.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                Icon: Fingerprint,
                title: "The Ring",
                body: "Your digital identity on your finger. A single tap shares the channels and context you choose.",
              },
              {
                Icon: Network,
                title: "The App",
                body: "Transforms your network into a living universe with circles, relationship health, and gentle reminders.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8"
              >
                <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-black">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">{title}</h3>
                <p className="leading-7 text-white/60">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 rounded-[40px] border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-mint">Belief</p>
          <p className="mt-6 max-w-4xl text-3xl font-black leading-tight md:text-5xl">
            Your network is your net worth, and you should be able to see it.
          </p>
          <div className="mt-10 grid gap-4 text-sm text-white/60 md:grid-cols-4">
            {[
              "Built for students, founders, creators, and connectors",
              "Private, secure, and designed for real-world simplicity",
              "Launching the first 1,000 rings soon",
              "The first step toward a full ecosystem of human connection",
            ].map((t) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-black/35 p-5">
                {t}
              </div>
            ))}
          </div>
        </div>

        <div id="team" className="mt-28">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-mint">The team</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                Operators building the bridge.
              </h2>
            </div>
            <Users className="hidden h-12 w-12 text-mint md:block" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {team.map((member) => (
              <article
                key={member.name}
                className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8"
              >
                <p className="text-2xl font-black">{member.name}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-mint">
                  {member.role}
                </p>
                <p className="mt-6 leading-7 text-white/60">{member.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div id="why-now" className="mt-28">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-mint">Why now</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                The moment finally caught up to the product.
              </h2>
              <div className="mt-8 rounded-[28px] border border-mint/30 bg-mint/10 p-6">
                <BadgeDollarSign className="mb-5 h-8 w-8 text-mint" />
                <p className="font-bold text-white">
                  Priced at an $8M cap with a working product, real users, 4 provisional patents
                  filed, and a clear path to revenue.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {whyNow.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7"
                >
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/60">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
