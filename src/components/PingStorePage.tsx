import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Preload } from "@react-three/drei";
import type { ReactNode } from "react";
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
  floatSpeed: number;
};

const whyNow = [
  {
    label: "The In-Person Problem",
    body: "Over 27 billion paper business cards are printed globally every year, yet 88% are discarded within a single week. Physical networking triggers lost cards, awkward QR-code camera fumbles, and cold dead-ends.",
  },
  {
    label: "The Digital Problem",
    body: "Professional networks are saturated with digital noise. Individual identities remain highly fragmented across social networks, portfolios, links, and calendars with no single way to consolidate them.",
  },
  {
    label: "The Solution",
    body: "Ping! bridges the physical world and the digital trail. A single hardware tap natively transfers a unified, customizable profile containing your contact details, socials, and work instantly.",
  },
];

const specs = [
  {
    label: "Material Form Factor",
    body: "Ultra-lightweight pure titanium build weighing only 2.5g with an exceptionally thin 2mm structural profile. Fully water-resistant and scratch-resilient.",
  },
  {
    label: "Ubiquitous NFC Layer",
    body: "Built-in native NFC loop architecture that reads automatically on every modern iOS and Android device right out of the box—no external application installation required to receive a profile.",
  },
  {
    label: "Technical Moat Layer",
    body: "Developing a proprietary Ring-to-Ring BLE firmware communication architecture, allowing physical hardware nodes to log mutual connections natively without a mobile device intermediating the interaction.",
  },
];

const creators = [
  {
    name: "Vaness “Reece” Gardner",
    role: "Founder & CEO",
    body: "Repeat founder working at the intersection of applied AI and hardware entrepreneurship. Pioneer of text-to-image-to-3D asset pipelines at Babson College, where he launched the initial ring concept. Founder of The Generator, scaling to 1,000+ members across MIT, Harvard, and Northeastern networks.",
  },
  {
    name: "Gaspard Seuge",
    role: "Co-Founder & CPO",
    body: "Serial product architect and alumnus of HEC Paris. Formerly growth lead at consumer AI startup MWM AI and AI Engineer at multi-billion dollar platform Sorare. Engineered the client-facing web application and native iOS mobile application frameworks from scratch.",
  },
];

const strategy = [
  {
    label: "Hardware Portal",
    body: "Premium one-time purchase of the physical titanium smart ring acting as the permanent identity key.",
  },
  {
    label: "Relationship Platform",
    body: "Freemium software architecture. Free users access standard profile compilation and contact sharing. Premium tiers unlock advanced deep-network visualization toolsets, predictive interaction tracking, and algorithmic follow-up reminders.",
  },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function CircuitBoard() {
  const traces = useMemo(() => {
    return Array.from({ length: 76 }, (_, index) => {
      const row = Math.floor(index / 2);
      const horizontal = index % 2 === 0;
      const x = (seededRandom(index * 3.11) - 0.5) * 40;
      const y = (seededRandom(index * 8.37) - 0.5) * 22;
      const length = 2.6 + seededRandom(index * 5.4) * 7;
      return { horizontal, length, x, y };
    });
  }, []);

  const nodes = useMemo(() => {
    return Array.from({ length: 38 }, (_, index) => ({
      x: (seededRandom(index * 6.2) - 0.5) * 40,
      y: (seededRandom(index * 9.7) - 0.5) * 22,
      scale: 0.05 + seededRandom(index * 2.2) * 0.08,
    }));
  }, []);

  return (
    <group rotation={[-1.08, 0, 0]} position={[0, -3.8, -9]}>
      <mesh receiveShadow>
        <planeGeometry args={[48, 28, 1, 1]} />
        <meshStandardMaterial
          color="#031c0e"
          emissive="#031c0e"
          emissiveIntensity={0.18}
          metalness={0.18}
          roughness={0.5}
        />
      </mesh>

      {traces.map((trace, index) => (
        <mesh key={`trace-${index}`} position={[trace.x, trace.y, 0.035]} rotation={[0, 0, trace.horizontal ? 0 : Math.PI / 2]}>
          <boxGeometry args={[trace.length, 0.035, 0.018]} />
          <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.46} toneMapped={false} />
        </mesh>
      ))}

      {nodes.map((node, index) => (
        <mesh key={`node-${index}`} position={[node.x, node.y, 0.055]}>
          <cylinderGeometry args={[node.scale, node.scale, 0.026, 16]} />
          <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.52} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingRing({ seed }: { seed: RingSeed }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.x += seed.spin[0];
    ref.current.rotation.y += seed.spin[1];
    ref.current.rotation.z += seed.spin[2];
    ref.current.position.y = seed.position[1] + Math.sin(t * seed.floatSpeed + seed.floatPhase) * 0.22;
    ref.current.position.x = seed.position[0] + Math.cos(t * seed.floatSpeed * 0.72 + seed.floatPhase) * 0.08;
  });

  return (
    <mesh ref={ref} position={seed.position} rotation={seed.rotation} scale={seed.scale} castShadow>
      <torusGeometry args={[0.44, 0.075, 24, 96]} />
      <meshStandardMaterial color="#050505" roughness={0.15} metalness={0.9} envMapIntensity={1.4} />
    </mesh>
  );
}

function FloatingRings() {
  const seeds = useMemo<RingSeed[]>(() => {
    return Array.from({ length: 28 }, (_, index) => {
      const band = index / 27;
      return {
        position: [
          (seededRandom(index * 2.7) - 0.5) * 16,
          0.4 + seededRandom(index * 4.1) * 4.8,
          -1.8 - band * 10 - seededRandom(index * 7.2) * 3,
        ],
        rotation: [seededRandom(index * 3.3) * Math.PI, seededRandom(index * 5.9) * Math.PI, seededRandom(index * 8.2) * Math.PI],
        scale: 0.5 + seededRandom(index * 1.71) * 1.1,
        spin: [
          0.001 + seededRandom(index * 2.12) * 0.004,
          0.001 + seededRandom(index * 4.22) * 0.006,
          0.0005 + seededRandom(index * 5.32) * 0.003,
        ],
        floatPhase: seededRandom(index * 9.13) * Math.PI * 2,
        floatSpeed: 0.45 + seededRandom(index * 3.44) * 0.8,
      };
    });
  }, []);

  return (
    <>
      {seeds.map((seed, index) => (
        <FloatingRing key={index} seed={seed} />
      ))}
    </>
  );
}

function WebGLBackground({ onReady }: { onReady: () => void }) {
  return (
    <div className="fixed inset-0 z-0 h-screen w-screen bg-black">
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={onReady}
        shadows
      >
        <PerspectiveCamera makeDefault fov={48} position={[0, 3.3, 7.5]} />
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 8, 25]} />
        <ambientLight intensity={0.42} />
        <directionalLight castShadow color="#ffffff" intensity={1.35} position={[4, 7, 5]} />
        <pointLight color="#00ff66" intensity={80} position={[-3, 1.5, -2]} distance={16} />
        <CircuitBoard />
        <FloatingRings />
        <Environment preset="night" />
        <Preload all />
      </Canvas>
    </div>
  );
}

function BootOverlay({ visible }: { visible: boolean }) {
  const [line, setLine] = useState(0);
  const lines = ["Loading Protocols...", "System Init // v2.26", "Compiling NFC Identity Layer", "WebGL Ring Matrix Online"];

  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(() => setLine((value) => Math.min(value + 1, lines.length - 1)), 420);
    return () => window.clearInterval(timer);
  }, [lines.length, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-black p-5 font-mono text-white md:p-8">
      <div className="text-[10px] uppercase tracking-[0.28em] text-[#00ff66]">PING BOOT SEQUENCE</div>
      <div className="space-y-4">
        {lines.slice(0, line + 1).map((item) => (
          <div className="border-b border-[#00ff66]/40 pb-3 text-sm uppercase tracking-[0.16em] md:text-xl" key={item}>
            {item}
          </div>
        ))}
        <div className="h-1 w-full bg-white/10">
          <div className="h-full bg-[#00ff66] transition-all duration-500" style={{ width: `${((line + 1) / lines.length) * 100}%` }} />
        </div>
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-[0.25em] text-white/60">
        <span>Ping Ring Inc.</span>
        <span>v2.26</span>
      </div>
    </div>
  );
}

function SectionBlock({
  children,
  eyebrow,
  id,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <section className="border-t border-[#00ff66]/45" id={id}>
      <div className="grid min-h-screen md:grid-cols-[0.42fr_0.58fr]">
        <div className="border-b border-[#00ff66]/35 p-5 md:border-b-0 md:border-r md:p-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#00ff66]">{eyebrow}</p>
          <h2 className="mt-8 max-w-xl text-4xl font-normal uppercase leading-[0.9] text-white md:text-7xl">{title}</h2>
        </div>
        <div className="divide-y divide-[#00ff66]/35">{children}</div>
      </div>
    </section>
  );
}

function TextRow({ body, label }: { body: string; label: string }) {
  return (
    <article className="p-5 md:p-8">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[#00ff66]">{label}</p>
      <p className="mt-8 max-w-4xl text-lg uppercase leading-[1.35] text-white md:text-3xl">{body}</p>
    </article>
  );
}

export function PingStorePage(_: PingStorePageProps) {
  const [canvasReady, setCanvasReady] = useState(false);
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setBootDone(true), 2300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.overflow = canvasReady && bootDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.scrollBehavior = "";
    };
  }, [bootDone, canvasReady]);

  const bootVisible = !canvasReady || !bootDone;

  return (
    <main className="min-h-screen bg-black font-mono text-white">
      <WebGLBackground onReady={() => setCanvasReady(true)} />
      <BootOverlay visible={bootVisible} />

      <div className="relative z-10">
        <header className="fixed left-0 right-0 top-0 z-40 grid grid-cols-[1fr_auto_1fr] border-b border-[#00ff66]/45 bg-black/35 px-4 py-4 text-[10px] uppercase tracking-[0.22em] backdrop-blur-sm md:px-7">
          <a className="text-[#00ff66]" href="#top">PING!</a>
          <nav className="hidden gap-7 text-white/78 md:flex">
            <a href="#friction">Friction</a>
            <a href="#specs">Specs</a>
            <a href="#creators">Creators</a>
            <a href="#strategy">Strategy</a>
          </nav>
          <a className="justify-self-end text-white" href="#strategy">Get Ping! →</a>
        </header>

        <section className="grid min-h-screen content-end px-4 pb-8 pt-28 md:px-7" id="top">
          <div className="max-w-6xl">
            <p className="mb-6 text-[10px] uppercase tracking-[0.32em] text-[#00ff66]">PING! // Ping Ring Inc.</p>
            <h1 className="max-w-6xl text-5xl font-normal uppercase leading-[0.85] text-white md:text-8xl lg:text-9xl">
              Identity Tracked. In-Person Connections Layered Natively.
            </h1>
            <p className="mt-7 max-w-2xl border-l border-[#00ff66] pl-5 text-sm uppercase leading-6 text-white md:text-lg">
              Proprietary digital identity execution layered directly over ultra-low-latency physical hardware infrastructure.
            </p>
          </div>
        </section>

        <div className="overflow-hidden border-y border-[#00ff66]/45 bg-black/55 py-4">
          <div className="ping-marquee flex w-[200%] whitespace-nowrap text-[10px] uppercase tracking-[0.26em] text-[#00ff66]">
            <span className="w-1/2">
              2.5G TITANIUM // 2MM PROFILE // NATIVE NFC // NO RECEIVER APP // IDENTITY KEY // RING-TO-RING BLE ROADMAP //
            </span>
            <span className="w-1/2">
              2.5G TITANIUM // 2MM PROFILE // NATIVE NFC // NO RECEIVER APP // IDENTITY KEY // RING-TO-RING BLE ROADMAP //
            </span>
          </div>
        </div>

        <SectionBlock eyebrow="01 // Cultural Friction" id="friction" title="Why physical identity now">
          {whyNow.map((item) => <TextRow body={item.body} key={item.label} label={item.label} />)}
        </SectionBlock>

        <SectionBlock eyebrow="02 // Technical Matrix" id="specs" title="Hardware and protocol surface">
          {specs.map((item) => <TextRow body={item.body} key={item.label} label={item.label} />)}
        </SectionBlock>

        <SectionBlock eyebrow="03 // Ecosystem Creators" id="creators" title="Operators behind the object">
          {creators.map((item) => <TextRow body={`${item.role}: ${item.body}`} key={item.name} label={item.name} />)}
        </SectionBlock>

        <SectionBlock eyebrow="04 // Platform Strategy" id="strategy" title="Revenue architecture">
          {strategy.map((item) => <TextRow body={item.body} key={item.label} label={item.label} />)}
          <article className="p-5 md:p-8">
            <a className="inline-flex border border-[#00ff66] bg-[#00ff66] px-7 py-4 text-[10px] font-bold uppercase tracking-[0.26em] text-black transition hover:bg-black hover:text-[#00ff66]" href="https://getping.today">
              Get Ping!
            </a>
          </article>
        </SectionBlock>

        <footer className="grid gap-4 border-t border-[#00ff66]/45 bg-black/65 p-5 text-[10px] uppercase tracking-[0.24em] text-white/70 md:grid-cols-3 md:p-7">
          <span>Ping Ring Inc.</span>
          <span>Real-world identity infrastructure</span>
          <span className="md:text-right">© Protocol v2.26</span>
        </footer>
      </div>

      <style>{`
        .ping-marquee { animation: ping-marquee 24s linear infinite; }
        @keyframes ping-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
