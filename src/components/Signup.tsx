import { FileText, Phone, Sparkles } from "lucide-react";

const steps = [
  "Reach out to Reece with your interest and intended investment amount.",
  "Join a call to confirm whether this is the right investment fit.",
  "Sign the standard YC post-money SAFE, pre-filled with your name and amount.",
  "Wire funds to Ping Ring Inc. and receive your countersigned copy.",
];

export function Signup() {
  return (
    <section id="invest" className="relative px-4 py-28">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[44px] border border-white/10 bg-[linear-gradient(135deg,rgba(89,255,183,0.22),rgba(255,255,255,0.05)_42%,rgba(255,255,255,0.02))] p-6 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-2 text-mint">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-bold uppercase tracking-[0.22em]">How to invest</p>
            </div>
            <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Standard YC SAFE. Same terms for everyone.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">
              $25,000 minimum check, no maximum check size. Everyone gets the same terms, same
              protections, and same $8M cap.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:talkwithping@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-mint px-7 py-4 text-sm font-black text-black transition-transform hover:scale-105"
              >
                <Phone className="h-4 w-4" /> Contact now
              </a>
              <a
                href="mailto:talkwithping@gmail.com?subject=Ping%20slide%20deck%20request"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/35 px-7 py-4 text-sm font-bold text-white"
              >
                <FileText className="h-4 w-4" /> Access slide deck here
              </a>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-black/70 p-6 md:p-8">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-3xl bg-white/[0.05] p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint text-sm font-black text-black">
                    {index + 1}
                  </div>
                  <p className="leading-7 text-white/70">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Contact</p>
              <p className="mt-4 text-2xl font-black">Vaness "Reece" Gardner</p>
              <p className="mt-1 text-white/60">Founder & CEO, Ping Ring Inc.</p>
              <div className="mt-5 grid gap-2 text-sm">
                <a className="text-mint hover:text-white" href="tel:+12076603626">
                  (207) 660-3626
                </a>
                <a className="text-mint hover:text-white" href="mailto:talkwithping@gmail.com">
                  talkwithping@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
