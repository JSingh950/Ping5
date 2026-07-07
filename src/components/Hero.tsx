import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    const video = videoRef.current;
    const nextMuted = !isMuted;

    if (video) {
      video.muted = nextMuted;
      void video.play();
    }

    setIsMuted(nextMuted);
  };

  return (
    <section id="ring" className="relative min-h-screen overflow-hidden px-4 pb-16 pt-36 md:pt-44">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(89,255,183,0.22),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0)_48%)]" />
      <div className="absolute left-1/2 top-20 h-[720px] w-[1200px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="pb-6">
          <p className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-mint">
            The future of networking
          </p>
          <h1 className="max-w-4xl text-6xl font-black leading-[0.92] tracking-tight md:text-8xl">
            Ping Ring.
            <span className="block text-white/50">Your digital identity on your finger.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
            A single tap shares your phone number, email, LinkedIn, Instagram, X, Venmo, and
            anything else you choose. No fumbling for phones. No forgetting to follow up. Just
            seamless, intentional connection.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#invest"
              className="rounded-full bg-mint px-8 py-4 text-center text-sm font-black text-black shadow-[0_0_50px_-8px_var(--mint)] transition-transform hover:scale-105"
            >
              Buy now · $49.99
            </a>
            <a
              href="#about"
              className="rounded-full border border-white/15 bg-white/10 px-8 py-4 text-center text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Start visualizing your network
            </a>
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-white/50">
            Limited first batch · No ring required to start
          </p>
        </div>

        <div className="relative min-h-[520px] lg:min-h-[660px]">
          <div className="absolute inset-0 rounded-[48px] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.02))] ring-1 ring-white/10" />
          <div className="absolute inset-x-10 top-10 h-32 rounded-full bg-mint/20 blur-3xl" />
          <div className="absolute left-1/2 top-8 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(255,255,255,0.09),rgba(255,255,255,0)_62%)]" />

          <div className="absolute inset-x-5 top-8 overflow-hidden rounded-[36px] border border-white/10 bg-black shadow-[0_44px_120px_rgba(0,0,0,0.75),0_0_90px_rgba(89,255,183,0.18)] md:inset-x-8">
            <video
              ref={videoRef}
              className="aspect-[4/5] w-full object-cover md:aspect-[5/6]"
              src="/ping-diagram-loop.mp4"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              aria-label="Looping Ping network diagram"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_54%,rgba(0,0,0,0.72))]" />
            <button
              type="button"
              onClick={toggleAudio}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white shadow-2xl backdrop-blur transition-colors hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2 focus:ring-offset-black"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
