import { Environment, PerspectiveCamera, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PingStorePageProps = {
  variant?: "fluid";
};

type Trace = {
  angle: number;
  length: number;
  x: number;
  y: number;
  width: number;
};

const accent = "#00ff66";
const sectionIds = ["top", "about", "markets", "platform", "why"];

const marketCards = [
  ["[ 01 ]", "Identity Markets", "Native NFC profile transfer for conferences, coworking rooms, clubs, and campus events."],
  ["[ 02 ]", "Hardware Layer", "Ultra-lightweight titanium ring form factor at 2.5g with a thin 2mm structural profile."],
  ["[ 03 ]", "Connection Graph", "Relationship software that consolidates contacts, socials, portfolios, and links into one tap."],
];

const whyCards = [
  ["Integrity", "Ping! is identity hardware, not a health tracker. The ring exists purely to bridge real-world connection to a chosen digital profile."],
  ["Ubiquity", "Every modern iPhone and Android device can receive a Ping! tap natively through NFC. No external receiver app is required."],
  ["Expediency", "A single tap removes lost cards, QR-code camera fumbles, fragmented links, and cold follow-up dead ends."],
];

const navServices = [
  ["NFC IDENTITY", "Native tap-to-profile transfer across iPhone and Android."],
  ["HARDWARE PORTAL", "Titanium smart ring gateway for real-world identity."],
  ["RELATIONSHIP GRAPH", "Software layer for physical-to-digital connection mapping."],
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function useScrollState() {
  const [state, setState] = useState({ active: 0, progress: 0 });

  useEffect(() => {
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = window.scrollY / max;
      const active = Math.min(sectionIds.length - 1, Math.max(0, Math.round(progress * (sectionIds.length - 1))));
      setState({ active, progress });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return state;
}

function CircuitScene({ onReady, progress }: { onReady: () => void; progress: number }) {
  return (
    <div className="fixed inset-0 z-0 h-screen w-screen bg-black">
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={onReady}
        shadows
      >
        <PerspectiveCamera makeDefault fov={40} position={[0, 3.65, 7.7]} />
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 8, 26]} />
        <ambientLight intensity={0.18} />
        <directionalLight castShadow color="#ffffff" intensity={1.25} position={[4.5, 7, 5]} />
        <pointLight color={accent} intensity={165} distance={18} position={[2.8, 1.1, 1.8]} />
        <pointLight color={accent} intensity={95} distance={20} position={[-5, -1.2, -7]} />
        <HardwareStage progress={progress} />
        <Environment preset="night" />
        <Preload all />
      </Canvas>
    </div>
  );
}

function HardwareStage({ progress }: { progress: number }) {
  const stage = useRef<THREE.Group>(null);
  const chip = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);

  const traces = useMemo<Trace[]>(() => {
    return Array.from({ length: 110 }, (_, index) => ({
      angle: (seededRandom(index * 2.71) - 0.5) * 0.42,
      length: 3 + seededRandom(index * 5.43) * 14,
      x: (seededRandom(index * 9.91) - 0.5) * 68,
      y: (seededRandom(index * 4.19) - 0.5) * 37,
      width: 0.018 + seededRandom(index * 7.2) * 0.038,
    }));
  }, []);

  const nodes = useMemo(() => {
    return Array.from({ length: 38 }, (_, index) => ({
      x: (seededRandom(index * 3.2) - 0.5) * 64,
      y: (seededRandom(index * 8.4) - 0.5) * 34,
      s: 0.05 + seededRandom(index * 6.1) * 0.08,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const heroShift = Math.min(1, progress * 4.15);
    const objectX = -2.65 + heroShift * 4.85;
    if (stage.current) {
      stage.current.rotation.x = -1.09 + progress * 0.23;
      stage.current.rotation.z = -0.08 + Math.sin(t * 0.08) * 0.025 + progress * 0.12;
      stage.current.position.y = -3.18 - progress * 0.35;
      stage.current.position.z = -8.5 + progress * 3.7;
    }
    if (chip.current) {
      chip.current.position.x = objectX;
      chip.current.position.y = 2.58 + Math.sin(t * 0.44) * 0.04;
      chip.current.position.z = -1.25 - progress * 1.25;
      chip.current.rotation.z = -0.1 + progress * 0.42;
      chip.current.rotation.y = -0.1 + progress * 0.62;
      chip.current.scale.setScalar(1.05);
    }
    if (ring.current) {
      ring.current.rotation.x = 1.25 + progress * 1.4;
      ring.current.rotation.y = t * 0.18 + progress * 2.2;
      ring.current.rotation.z = 0.15 + Math.sin(t * 0.4) * 0.06;
      ring.current.position.x = objectX;
      ring.current.position.y = 3.5 + Math.sin(t * 0.52) * 0.08;
      ring.current.position.z = -1.08 - progress * 1.25;
      ring.current.scale.setScalar(1.12);
    }
  });

  return (
    <group>
      <group ref={stage} position={[0, -3.18, -8.5]} rotation={[-1.09, 0, -0.08]}>
        <mesh receiveShadow>
          <planeGeometry args={[74, 44]} />
          <meshStandardMaterial color="#021006" emissive="#031c0e" emissiveIntensity={0.28} metalness={0.28} roughness={0.48} />
        </mesh>

        {traces.map((trace, index) => (
          <mesh key={`trace-${index}`} position={[trace.x, trace.y, 0.055]} rotation={[0, 0, trace.angle]}>
            <boxGeometry args={[trace.length, trace.width, 0.022]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.72} toneMapped={false} />
          </mesh>
        ))}

        {nodes.map((node, index) => (
          <mesh key={`node-${index}`} position={[node.x, node.y, 0.075]}>
            <cylinderGeometry args={[node.s, node.s, 0.03, 18]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <group ref={chip} position={[-2.65, 2.58, -1.25]} rotation={[0, -0.1, -0.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.15, 0.46, 2.15]} />
          <meshStandardMaterial color="#080908" metalness={0.75} roughness={0.22} emissive="#07170d" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[3.32, 0.32, 2.28]} />
          <meshStandardMaterial color="#05280f" emissive={accent} emissiveIntensity={0.45} toneMapped={false} roughness={0.36} />
        </mesh>
        {Array.from({ length: 16 }).map((_, index) => (
          <mesh key={`pin-${index}`} position={[-1.45 + (index % 8) * 0.41, -0.09, index < 8 ? -1.25 : 1.25]}>
            <boxGeometry args={[0.11, 0.15, 0.36]} />
            <meshStandardMaterial color="#0cff69" emissive={accent} emissiveIntensity={0.82} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <group ref={ring} position={[-2.65, 3.5, -1.08]}>
        <mesh castShadow>
          <torusGeometry args={[0.86, 0.14, 40, 180]} />
          <meshStandardMaterial color="#030303" metalness={0.96} roughness={0.1} envMapIntensity={2.35} />
        </mesh>
        <mesh scale={1.14}>
          <torusGeometry args={[0.86, 0.012, 8, 180]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.85} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Loader({ visible }: { visible: boolean }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(() => setPercent((value) => Math.min(100, value + 5)), 45);
    return () => window.clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black text-white" data-boot="true">
      <div className="w-[248px]">
        <div className="mb-4 h-[28px] border border-white/25 p-1">
          <div className="flex h-full items-center bg-white px-2 text-[20px] leading-none text-black" style={{ width: `${percent}%` }}>
            {percent}%
          </div>
        </div>
        <div className="flex justify-center gap-1 text-[24px] uppercase leading-none tracking-[0.02em]">
          <span>Loading Protocols</span>
          <span className="text-[#00ff66]">.....</span>
        </div>
        <div className="mt-8 text-center text-[24px] uppercase leading-none">Loading Ping</div>
      </div>
      <div className="absolute bottom-7 left-8 text-[12px] uppercase tracking-[0.08em] text-white/70">Cc 2026, ping</div>
      <div className="absolute bottom-7 right-8 text-[12px] uppercase tracking-[0.08em] text-white/70">designed + developed by Ping Ring Inc.</div>
    </div>
  );
}

function Header() {
  return (
    <header className="group fixed left-0 top-0 z-40 flex h-[78px] w-full items-center border-b border-white/10 bg-black/72 px-8 backdrop-blur-sm">
      <a className="mr-auto flex items-center gap-3 text-[22px] font-bold uppercase tracking-[0.02em]" href="#top">
        <span className="grid h-5 w-9 grid-cols-3 gap-[2px]">
          {Array.from({ length: 9 }).map((_, index) => (
            <span className="h-[5px] w-[10px] -skew-x-12 bg-white" key={index} />
          ))}
        </span>
        Ping
      </a>
      <nav className="hidden items-center gap-9 text-[12px] uppercase tracking-[0.16em] md:flex">
        <a href="#top">Home</a>
        <a href="#about">What we do <span className="text-[#00ff66]">▾</span></a>
        <a href="#markets">Markets</a>
        <a href="#platform">About</a>
        <a href="#why">Careers</a>
      </nav>
      <a className="ml-auto hidden border border-white/20 px-8 py-4 text-[12px] uppercase tracking-[0.25em] md:block" href="https://getping.today">
        Let&apos;s connect →
      </a>
      <a className="ml-auto text-[12px] uppercase tracking-[0.2em] md:hidden" href="#about">menu</a>
      <div className="pointer-events-none absolute left-0 top-[78px] hidden w-full border-b border-white/10 bg-black/92 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 md:block">
        <div className="mx-auto grid w-[75vw] max-w-[1080px] grid-cols-3 gap-px bg-white/10 py-8">
          {navServices.map(([title, body]) => (
            <a className="min-h-32 bg-black p-6 text-left" href="#markets" key={title}>
              <p className="text-[12px] uppercase tracking-[0.22em] text-[#00ff66]">{title}</p>
              <p className="mt-4 text-[14px] leading-5 text-white/70">{body}</p>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

function ProgressRail({ active }: { active: number }) {
  const labels = ["01", "about", "markets", "04", "05"];

  return (
    <aside className="fixed right-8 top-1/2 z-40 hidden -translate-y-1/2 md:block" data-nav-rail>
      <div className="absolute left-[48px] top-4 h-[325px] w-px bg-white/25" />
      <div className="absolute left-[46px] top-4 h-2 w-2 rounded-full bg-[#00ff66]" />
      <div className="absolute left-[46px] top-[96px] h-2 w-2 rounded-full bg-[#00ff66]" />
      <div className="absolute left-[46px] top-[178px] h-2 w-2 rounded-full bg-[#00ff66]" />
      <div className="absolute left-[47px] top-[260px] h-[5px] w-[5px] rounded-full bg-white/40" />
      <div className="flex flex-col gap-[52px]">
        {labels.map((label, index) => (
          <a
            className={`relative grid h-[29px] min-w-[36px] place-items-center border px-3 text-[10px] uppercase tracking-[0.1em] ${
              active === index ? "border-white text-white" : "border-white/35 text-white"
            }`}
            href={`#${sectionIds[index]}`}
            key={label}
          >
            {active === index ? label : label.replace("about", "02").replace("markets", "03")}
          </a>
        ))}
      </div>
    </aside>
  );
}

function HeroSection() {
  return (
    <header className="section relative min-h-screen pt-[78px]" id="top">
      <div className="mx-auto flex min-h-[calc(100vh-78px)] w-[75vw] max-w-[1080px] flex-col justify-between py-[74px]">
        <h1 className="display-type max-w-[1080px] text-[48px] uppercase leading-[0.82] text-white md:text-[88px]">
          <span className="ml-[14%] block whitespace-nowrap">EMPOWERING <span className="text-[#00ff66]">NATIVE</span></span>
          <span className="ml-[31%] block whitespace-nowrap">DIGITAL IDENTITY<span className="text-[#00ff66]">.</span></span>
        </h1>
        <div className="ml-auto w-full max-w-[442px] pb-1">
          <h2 className="mono-title text-[24px] uppercase leading-none">we are ping</h2>
          <p className="mt-5 text-[16px] leading-6 text-white">
            Ping! is identity infrastructure for real-world connection: NFC ring hardware, portfolio exchange, and relationship intelligence.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-5">
            <a className="button-raven is-solid" href="https://getping.today">Get Ping!</a>
            <a className="button-raven is-solid" href="#platform">Creators</a>
          </div>
          <a className="mt-8 block text-[12px] uppercase tracking-[0.12em] text-white/50" href="#about">Scroll to learn more...</a>
        </div>
      </div>
    </header>
  );
}

function AboutSection() {
  return (
    <section className="section min-h-screen" id="about">
      <div className="mx-auto flex min-h-screen w-[75vw] max-w-[1080px] items-center">
        <div className="w-full max-w-[442px]">
          <h2 className="mono-title text-[24px] uppercase leading-none">About u5</h2>
          <p className="mt-5 text-[16px] leading-6 text-white">
            Ping! is an NFC-enabled smart ring designed purely for identity, portfolios, and bridging physical in-person connection to your digital trail.
          </p>
          <p className="mt-5 text-[16px] leading-6 text-white">
            Built after the rise of AI made digital interactions feel less human, Ping! turns a real-world moment into one clean profile tap.
          </p>
          <div className="mt-8 text-[12px] uppercase tracking-[0.22em] text-white/55">
            Verified by <span className="text-[#00ff66]">*</span>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-8 text-[13px] font-bold uppercase tracking-[0.12em] text-white">
            <span>Babson AI Lab</span>
            <span>HEC Paris</span>
            <span>Sorare</span>
            <span>MWM AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketsSection() {
  return (
    <section className="section min-h-screen pt-[78px]" id="markets">
      <div className="mx-auto flex min-h-[calc(100vh-78px)] w-[75vw] max-w-[1080px] flex-col justify-center">
        <div className="ml-auto max-w-[406px] pb-24">
          <h2 className="mono-title text-[24px] uppercase leading-none">Markets we operate in</h2>
          <p className="mt-5 text-[16px] leading-6 text-white">Continuously mapping identity moments across physical and digital networks.</p>
        </div>
        <div className="grid border border-white/12 md:grid-cols-3">
          {marketCards.map(([number, title, body]) => (
            <article className="min-h-[288px] border-b border-white/12 p-8 md:border-b-0 md:border-r last:md:border-r-0" key={title}>
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#00ff66]">{number}</p>
              <h3 className="display-type mt-6 text-[42px] uppercase leading-[0.95] text-white">{title}</h3>
              <p className="mt-6 text-[16px] leading-6 text-white">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformSection() {
  return (
    <section className="section min-h-screen pt-[78px]" id="platform">
      <div className="mx-auto grid min-h-[calc(100vh-78px)] w-[75vw] max-w-[1080px] content-center gap-10 md:grid-cols-[0.42fr_0.58fr]">
        <div>
          <h2 className="mono-title text-[24px] uppercase leading-none">Trading on</h2>
          <p className="mt-5 text-[16px] leading-6 text-white">
            Ultra-lightweight titanium hardware and a relationship platform designed for modern in-person identity exchange.
          </p>
        </div>
        <div className="grid grid-cols-2 border border-white/12 md:grid-cols-3">
          {["2.5g titanium", "2mm profile", "native NFC", "no app to receive", "portfolio links", "BLE roadmap"].map((item) => (
            <div className="grid h-28 place-items-center border-b border-r border-white/12 p-4 text-center text-[12px] uppercase tracking-[0.16em] text-white/80" key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustrySection() {
  return (
    <section className="section grid min-h-screen place-items-center" id="why">
      <div className="mx-auto w-[75vw] max-w-[1080px]">
        <h2 className="display-type text-center text-[72px] uppercase leading-[0.82] md:text-[132px]">powering identity</h2>
        <p className="mx-auto mt-8 max-w-[520px] text-center text-[18px] leading-7 text-white">
          Wide, competitive, and uninterrupted coverage of real-world connection moments across events, campuses, clubs, and coworking rooms.
        </p>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="section min-h-screen pt-[78px]">
      <div className="mx-auto flex min-h-[calc(100vh-78px)] w-[75vw] max-w-[1080px] flex-col justify-center">
        <h2 className="mono-title text-[24px] uppercase leading-none">Why Us?</h2>
        <div className="mt-12 grid gap-px border border-white/12 bg-white/12 md:grid-cols-3">
          {whyCards.map(([title, body]) => (
            <article className="bg-black/72 p-8" key={title}>
              <h3 className="display-type text-[42px] uppercase leading-none text-white">{title}</h3>
              <p className="mt-6 text-[16px] leading-6 text-white">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black px-8 py-12 text-white">
      <div className="mx-auto grid w-[75vw] max-w-[1080px] gap-8 md:grid-cols-[0.5fr_0.25fr_0.25fr]">
        <p className="max-w-xl text-[16px] leading-6 text-white/75">
          Our mission is to bridge physical connection and digital identity. Ping! is built for identity, portfolios, and real-world network intelligence.
        </p>
        <div className="text-[12px] uppercase tracking-[0.16em] text-white/60">What we do<br />Markets<br />Industry</div>
        <div className="text-[12px] uppercase tracking-[0.16em] text-white/60">About<br />Why us?<br />Contact<br /><br />designed + developed by black peak</div>
      </div>
    </footer>
  );
}

export function PingStorePage(_: PingStorePageProps) {
  const { active, progress } = useScrollState();
  const [ready, setReady] = useState(false);
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setBootDone(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = ready && bootDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [bootDone, ready]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <CircuitScene onReady={() => setReady(true)} progress={progress} />
      <Loader visible={!ready || !bootDone} />
      <Header />
      <ProgressRail active={active} />

      <div className="relative z-10 md:snap-y md:snap-mandatory">
        <HeroSection />
        <AboutSection />
        <MarketsSection />
        <PlatformSection />
        <IndustrySection />
        <WhySection />
        <Footer />
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; background: #000000; }
        html, body { max-width: 100%; overflow-x: hidden; }
        body { background: #000000; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .section { scroll-snap-align: start; scroll-snap-stop: always; }
        .display-type {
          font-family: Monaco, "Lucida Console", "Andale Mono", ui-monospace, monospace;
          letter-spacing: -0.08em;
          font-weight: 700;
          text-transform: uppercase;
          transform: scaleX(1);
          transform-origin: left center;
        }
        .mono-title {
          font-family: "Courier New", ui-monospace, SFMono-Regular, Menlo, monospace;
          letter-spacing: 0.08em;
          font-weight: 700;
        }
        .button-raven {
          display: grid;
          place-items: center;
          min-height: 36px;
          border: 1px solid rgba(255,255,255,0.18);
          color: #ffffff;
          font-size: 12px;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: border-color 180ms ease, color 180ms ease;
        }
        .button-raven:hover { border-color: ${accent}; color: ${accent}; }
        .button-raven.is-solid {
          border-color: ${accent};
          background: ${accent};
          color: #000000;
          font-weight: 800;
        }
        .button-raven.is-solid:hover {
          background: #ffffff;
          border-color: #ffffff;
          color: #000000;
        }
      `}</style>
    </main>
  );
}
