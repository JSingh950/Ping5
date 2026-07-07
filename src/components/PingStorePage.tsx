import { Environment, PerspectiveCamera, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PingStorePageProps = {
  variant?: "fluid";
};

type RingSeed = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  spin: [number, number, number];
  floatPhase: number;
};

const sectionIds = ["top", "friction", "specs", "creators", "strategy"];

const friction = [
  ["The In-Person Problem", "Over 27 billion paper business cards are printed globally every year, yet 88% are discarded within a single week. Physical networking triggers lost cards, awkward QR-code camera fumbles, and cold dead-ends."],
  ["The Digital Problem", "Professional networks are saturated with digital noise. Individual identities remain highly fragmented across social networks, portfolios, links, and calendars with no single way to consolidate them."],
  ["The Solution", "Ping! bridges the physical world and the digital trail. A single hardware tap natively transfers a unified, customizable profile containing your contact details, socials, and work instantly."],
];

const specs = [
  ["Material Form Factor", "Ultra-lightweight pure titanium build weighing only 2.5g with an exceptionally thin 2mm structural profile. Fully water-resistant and scratch-resilient."],
  ["Ubiquitous NFC Layer", "Built-in native NFC loop architecture that reads automatically on every modern iOS and Android device right out of the box—no external application installation required to receive a profile."],
  ["Technical Moat Layer", "Developing a proprietary Ring-to-Ring BLE firmware communication architecture, allowing physical hardware nodes to log mutual connections natively without a mobile device intermediating the interaction."],
];

const creators = [
  ["Vaness “Reece” Gardner", "Founder & CEO: Repeat founder working at the intersection of applied AI and hardware entrepreneurship. Pioneer of text-to-image-to-3D asset pipelines at Babson College, where he launched the initial ring concept. Founder of The Generator, scaling to 1,000+ members across MIT, Harvard, and Northeastern networks."],
  ["Gaspard Seuge", "Co-Founder & CPO: Serial product architect and alumnus of HEC Paris. Formerly growth lead at consumer AI startup MWM AI and AI Engineer at multi-billion dollar platform Sorare. Engineered the client-facing web application and native iOS mobile application frameworks from scratch."],
];

const strategy = [
  ["Hardware Portal", "Premium one-time purchase of the physical titanium smart ring acting as the permanent identity key."],
  ["Relationship Platform", "Freemium software architecture. Free users access standard profile compilation and contact sharing. Premium tiers unlock advanced deep-network visualization toolsets, predictive interaction tracking, and algorithmic follow-up reminders."],
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function useScrollProgress() {
  const [state, setState] = useState({ active: 0, progress: 0 });

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
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

function CircuitBoard({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null);
  const traces = useMemo(() => {
    return Array.from({ length: 128 }, (_, index) => {
      const horizontal = index % 3 !== 0;
      const x = (seededRandom(index * 3.11) - 0.5) * 72;
      const y = (seededRandom(index * 8.37) - 0.5) * 42;
      const length = 3 + seededRandom(index * 5.4) * 13;
      const width = 0.025 + seededRandom(index * 2.2) * 0.04;
      return { horizontal, length, width, x, y };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.x = -1.12 + progress * 0.34;
    group.current.rotation.z = Math.sin(t * 0.08) * 0.02;
    group.current.position.z = -8 + progress * 4.8;
    group.current.position.y = -2.55 - progress * 0.9;
  });

  return (
    <group ref={group} position={[0, -2.55, -8]} rotation={[-1.12, 0, 0]}>
      <mesh receiveShadow>
        <planeGeometry args={[76, 46, 1, 1]} />
        <meshStandardMaterial color="#031c0e" emissive="#031c0e" emissiveIntensity={0.36} roughness={0.44} metalness={0.18} />
      </mesh>
      <gridHelper args={[76, 76, "#00ff66", "#064820"]} position={[0, 0, 0.055]} />
      {traces.map((trace, index) => (
        <mesh key={index} position={[trace.x, trace.y, 0.08]} rotation={[0, 0, trace.horizontal ? 0 : Math.PI / 2]}>
          <boxGeometry args={[trace.length, trace.width, 0.025]} />
          <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.52} toneMapped={false} />
        </mesh>
      ))}
      {Array.from({ length: 42 }).map((_, index) => (
        <mesh key={`node-${index}`} position={[(seededRandom(index * 4.2) - 0.5) * 70, (seededRandom(index * 9.1) - 0.5) * 40, 0.1]}>
          <cylinderGeometry args={[0.085, 0.085, 0.035, 18]} />
          <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.62} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function RingMesh({ seed }: { seed: RingSeed }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.x += seed.spin[0];
    ref.current.rotation.y += seed.spin[1];
    ref.current.rotation.z += seed.spin[2];
    ref.current.position.y = seed.position[1] + Math.sin(t * 0.72 + seed.floatPhase) * 0.18;
  });

  return (
    <mesh ref={ref} castShadow position={seed.position} rotation={seed.rotation} scale={seed.scale}>
      <torusGeometry args={[0.5, 0.085, 32, 128]} />
      <meshStandardMaterial color="#050505" roughness={0.15} metalness={0.9} envMapIntensity={1.8} />
    </mesh>
  );
}

function RingField({ progress }: { progress: number }) {
  const rig = useRef<THREE.Group>(null);
  const hero = useRef<THREE.Group>(null);
  const seeds = useMemo<RingSeed[]>(() => {
    return Array.from({ length: 30 }, (_, index) => ({
      position: [
        (seededRandom(index * 4.7) - 0.5) * 18,
        -0.1 + seededRandom(index * 2.8) * 5.2,
        -4 - seededRandom(index * 8.1) * 11,
      ],
      rotation: [seededRandom(index * 3.3) * Math.PI, seededRandom(index * 5.9) * Math.PI, seededRandom(index * 8.2) * Math.PI],
      scale: 0.38 + seededRandom(index * 1.71) * 0.9,
      spin: [
        0.0008 + seededRandom(index * 2.12) * 0.004,
        0.001 + seededRandom(index * 4.22) * 0.006,
        0.0006 + seededRandom(index * 5.32) * 0.003,
      ],
      floatPhase: seededRandom(index * 9.13) * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (rig.current) {
      rig.current.rotation.y = progress * Math.PI * 0.52;
      rig.current.position.z = progress * 5.2;
      rig.current.position.x = Math.sin(progress * Math.PI) * -1.4;
    }
    if (hero.current) {
      hero.current.rotation.x = -0.24 + progress * 1.2 + Math.sin(t * 0.4) * 0.04;
      hero.current.rotation.y = progress * Math.PI * 1.25 + t * 0.08;
      hero.current.position.x = 2.25 - progress * 4.4;
      hero.current.position.y = 1.15 + Math.sin(t * 0.5) * 0.08;
      hero.current.position.z = -1.4 - progress * 3.4;
      const scale = 1.9 - progress * 0.45;
      hero.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <group ref={hero}>
        <mesh castShadow>
          <torusGeometry args={[0.76, 0.13, 40, 160]} />
          <meshStandardMaterial color="#050505" roughness={0.12} metalness={0.94} envMapIntensity={2} />
        </mesh>
        <mesh scale={1.18}>
          <torusGeometry args={[0.76, 0.012, 8, 160]} />
          <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      </group>
      <group ref={rig}>
        {seeds.map((seed, index) => <RingMesh key={index} seed={seed} />)}
      </group>
    </group>
  );
}

function Scene({ onReady, progress }: { onReady: () => void; progress: number }) {
  return (
    <div className="fixed inset-0 z-0 h-screen w-screen bg-black">
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={onReady}
        shadows
      >
        <PerspectiveCamera makeDefault fov={45} position={[0, 2.4, 6.2]} />
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 9, 28]} />
        <ambientLight intensity={0.32} />
        <directionalLight castShadow color="#ffffff" intensity={1.6} position={[3, 6, 4]} />
        <pointLight color="#00ff66" intensity={130} distance={18} position={[-3, 1.8, 2]} />
        <pointLight color="#00ff66" intensity={70} distance={24} position={[5, 0.3, -8]} />
        <CircuitBoard progress={progress} />
        <RingField progress={progress} />
        <Environment preset="night" />
        <Preload all />
      </Canvas>
    </div>
  );
}

function BootOverlay({ visible }: { visible: boolean }) {
  const [line, setLine] = useState(0);
  const lines = ["Loading Protocols", "Loading Ping", "System Init // v2.26", "Circuit scene online"];

  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(() => setLine((value) => Math.min(value + 1, lines.length - 1)), 360);
    return () => window.clearInterval(timer);
  }, [lines.length, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-black p-5 font-mono text-white md:p-8">
      <div className="text-[10px] uppercase tracking-[0.28em] text-white/70">Loading Protocols</div>
      <div>
        {lines.slice(0, line + 1).map((item) => (
          <p className="border-b border-[#00ff66]/45 py-4 text-xl uppercase tracking-[0.08em] text-white md:text-5xl" key={item}>
            {item}
          </p>
        ))}
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-[0.25em] text-white/55">
        <span>Cc 2026, Ping</span>
        <span>designed + developed by Ping Ring Inc.</span>
      </div>
    </div>
  );
}

function NavRail({ active }: { active: number }) {
  return (
    <aside className="fixed bottom-8 left-5 z-30 hidden flex-col gap-4 text-[11px] uppercase tracking-[0.24em] text-white/45 md:flex" data-nav-rail>
      {["start", "02", "03", "04", "05"].map((item, index) => (
        <a className={active === index ? "text-[#00ff66]" : "hover:text-white"} href={`#${sectionIds[index]}`} key={item}>
          {item}
        </a>
      ))}
    </aside>
  );
}

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 text-[11px] uppercase tracking-[0.2em] text-white md:px-7">
      <a className="text-[#00ff66]" href="#top">PING!</a>
      <nav className="hidden items-center gap-8 text-white/70 md:flex">
        <a href="#top">Home</a>
        <a href="#friction">What we do ▾</a>
        <a href="#specs">Markets</a>
        <a href="#creators">About</a>
        <a href="#strategy">Let&apos;s connect →</a>
      </nav>
      <a className="md:hidden" href="#strategy">menu</a>
    </header>
  );
}

function HeroPanel() {
  return (
    <section className="relative grid min-h-screen snap-start content-end px-5 pb-10 pt-24 md:px-7" id="top">
      <div className="max-w-6xl">
        <div className="mb-8 grid max-w-xl grid-cols-3 gap-px border border-[#00ff66]/45 bg-[#00ff66]/45 text-[10px] uppercase tracking-[0.2em] text-white/80">
          {["Identity", "NFC", "Hardware"].map((item) => <span className="bg-black/65 p-3" key={item}>{item}</span>)}
        </div>
        <h1 className="max-w-full text-[21vw] font-normal uppercase leading-[0.78] text-white md:text-[9.2vw]">
          Identity<br />
          <span className="text-[#00ff66]">Layered</span><br />
          Natively
        </h1>
        <div className="mt-8 grid gap-4 md:grid-cols-[0.44fr_0.56fr]">
          <h2 className="text-2xl uppercase leading-none text-white md:text-5xl">we are ping</h2>
          <p className="max-w-2xl text-sm uppercase leading-6 text-white/72 md:text-base">
            Proprietary digital identity execution layered directly over ultra-low-latency physical hardware infrastructure.
          </p>
        </div>
      </div>
      <p className="absolute bottom-8 right-7 hidden text-[10px] uppercase tracking-[0.22em] text-white/55 md:block">Scroll to learn more...</p>
    </section>
  );
}

function SplitPanel({
  eyebrow,
  id,
  rows,
  title,
}: {
  eyebrow: string;
  id: string;
  rows: string[][];
  title: string;
}) {
  return (
    <section className="grid min-h-screen snap-start border-t border-[#00ff66]/45 bg-black/12 md:grid-cols-[0.38fr_0.62fr]" id={id}>
      <div className="flex flex-col justify-between border-b border-[#00ff66]/40 p-5 pt-24 md:border-b-0 md:border-r md:p-7 md:pt-28">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#00ff66]">{eyebrow}</p>
        <h2 className="mt-10 text-5xl font-normal uppercase leading-[0.86] text-white md:text-7xl">{title}</h2>
      </div>
      <div className="divide-y divide-[#00ff66]/35 pt-0 md:pt-20">
        {rows.map(([label, body]) => (
          <article className="p-5 md:p-7" key={label}>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#00ff66]">{label}</p>
            <p className="mt-7 max-w-4xl text-lg uppercase leading-[1.22] text-white md:text-3xl">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PingStorePage(_: PingStorePageProps) {
  const { active, progress } = useScrollProgress();
  const [ready, setReady] = useState(false);
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setBootDone(true), 2300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = ready && bootDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [bootDone, ready]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black font-mono text-white">
      <Scene onReady={() => setReady(true)} progress={progress} />
      <BootOverlay visible={!ready || !bootDone} />
      <Header />
      <NavRail active={active} />

      <div className="relative z-10 scroll-smooth md:snap-y md:snap-mandatory">
        <HeroPanel />

        <div className="overflow-hidden border-y border-[#00ff66]/45 bg-black/55 py-4">
          <div className="ping-marquee flex min-w-[260vw] whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-[#00ff66] md:w-[200%] md:tracking-[0.26em]">
            <span className="w-1/2">2.5G TITANIUM // 2MM PROFILE // NATIVE NFC // NO RECEIVER APP // IDENTITY KEY // RING-TO-RING BLE ROADMAP //</span>
            <span className="w-1/2">2.5G TITANIUM // 2MM PROFILE // NATIVE NFC // NO RECEIVER APP // IDENTITY KEY // RING-TO-RING BLE ROADMAP //</span>
          </div>
        </div>

        <SplitPanel eyebrow="About us" id="friction" rows={friction} title="Physical identity infrastructure" />
        <SplitPanel eyebrow="Markets we operate in" id="specs" rows={specs} title="Technical specifications matrix" />
        <SplitPanel eyebrow="Why Us?" id="creators" rows={creators} title="Ecosystem creators" />
        <SplitPanel eyebrow="Powering the industry" id="strategy" rows={strategy} title="Revenue and platform strategy" />

        <footer className="grid gap-4 border-t border-[#00ff66]/45 bg-black/75 p-5 text-[10px] uppercase tracking-[0.24em] text-white/70 md:grid-cols-3 md:p-7">
          <span>Ping Ring Inc.</span>
          <span>Our mission is to bridge physical connection and digital identity.</span>
          <a className="text-[#00ff66] md:text-right" href="https://getping.today">Get Ping! →</a>
        </footer>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        html, body { max-width: 100%; overflow-x: hidden; }
        body { background: #000000; }
        .ping-marquee { animation: ping-marquee 23s linear infinite; }
        @keyframes ping-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
