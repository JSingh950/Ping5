import { Environment, PerspectiveCamera, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
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

type BoardPlate = {
  angle: number;
  height: number;
  x: number;
  y: number;
  width: number;
};

type RingSeed = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rx: number;
  ry: number;
  rz: number;
};

const accent = "#ff4d16";
const sectionIds = ["top", "about", "markets", "platform", "industry", "why"];

const marketCards = [
  ["[ 01 ]", "Identity Markets", "Premium identity exchange for events, campuses, and high-density rooms."],
  ["[ 02 ]", "Connection Markets", "Persistent contact memory and profile routing for the people you meet."],
  ["[ 03 ]", "Digital Finance", "Tap-based identity infrastructure for portfolios, socials, payments, and follow-up."],
];

const whyCards = [
  ["Integrity", "We keep the physical connection clear and intentional. Ping is built around chosen identity exchange, not passive tracking."],
  ["Transparency", "Every tap shares exactly what the wearer chooses. Profiles, links, socials, and contact details stay visible and controlled."],
  ["Expediency", "High-speed handoff removes lost cards, QR-code camera fumbles, fragmented links, and cold follow-up dead ends."],
];

const navGroups = [
  {
    title: "Identity Layer",
    items: [
      ["Tap Profiles", "Native tap-to-profile exchange for modern phones."],
      ["Creator Portfolios", "Work, socials, payments, and contact details in one link."],
      ["Event Networks", "Fast capture for rooms where every introduction matters."],
    ],
  },
  {
    title: "Ring Programs",
    items: [
      ["Launch Batches", "Small-batch hardware drops for early communities."],
      ["Campus Coverage", "Identity exchange for clubs, teams, and alumni rooms."],
      ["Founder Rooms", "Relationship memory for demos, dinners, and conferences."],
    ],
  },
  {
    title: "Flagship Systems",
    items: [
      ["Network Graph", "A software layer that remembers who you met and why."],
      ["Profile Control", "Choose exactly what a tap reveals in each context."],
      ["BLE Roadmap", "Future proximity features layered onto the same wearable."],
    ],
  },
];

const platformCells = [
  "2.5g titanium",
  "2mm profile",
  "native NFC",
  "no charging",
  "no receiver app",
  "custom profile",
  "social links",
  "portfolio links",
  "payment links",
  "contact export",
  "event mode",
  "BLE roadmap",
];

const proofLogos = ["Babson", "HEC Paris", "Generator", "Ping Lab"];

const exchangeLogos = [
  "Ping",
  "LinkedIn",
  "Instagram",
  "X",
  "Venmo",
  "Notion",
  "Calendly",
  "HubSpot",
  "Airtable",
  "Figma",
  "Slack",
  "Stripe",
  "Arc",
  "Linear",
  "Gemini",
  "Babson",
  "HEC Paris",
  "Revolut",
];

const industryPills = [
  "profile",
  "contact",
  "linkedin",
  "instagram",
  "portfolio",
  "venmo",
  "email",
  "phone",
];

const industryBands = [
  ["powering the industry", "Wide, competitive, and uninterrupted coverage of connection moments across campuses and events"],
  ["powering the industry", "Wide, competitive, and uninterrupted coverage of profile exchange across real-world communities"],
  ["powering the industry", "Wide, competitive, and uninterrupted coverage of identity handoff across high-density rooms"],
];

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function useScrollState() {
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = Math.max(1, window.innerHeight * (sectionIds.length - 1));
      const progress = clamp(window.scrollY / max);
      const nextActive = Math.min(sectionIds.length - 1, Math.max(0, Math.round(progress * (sectionIds.length - 1))));
      progressRef.current = progress;
      setActive((current) => (current === nextActive ? current : nextActive));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { active, progressRef };
}

function CircuitScene({ onReady, progressRef }: { onReady: () => void; progressRef: MutableRefObject<number> }) {
  return (
    <div className="fixed inset-0 z-0 h-screen w-screen bg-black">
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
        onCreated={onReady}
      >
        <PerspectiveCamera makeDefault fov={36} position={[0.15, 3.6, 8.4]} />
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 8, 26]} />
        <ambientLight intensity={0.12} />
        <directionalLight color="#ffffff" intensity={0.95} position={[4.5, 7, 5]} />
        <pointLight color={accent} intensity={230} distance={18} position={[-2.1, 1.1, 1.2]} />
        <pointLight color={accent} intensity={120} distance={20} position={[5, -1.2, -7]} />
        <HardwareStage progressRef={progressRef} />
        <Environment preset="night" />
        <Preload all />
      </Canvas>
    </div>
  );
}

function ChipModel({ mini = false }: { mini?: boolean }) {
  const body = mini ? [1.35, 0.28, 0.92] : [3.25, 0.5, 2.18];
  const glow = mini ? [1.42, 0.24, 0.98] : [3.38, 0.42, 2.32];
  const pins = mini ? 6 : 16;
  const pinStep = mini ? 0.25 : 0.41;
  const pinStart = mini ? -0.62 : -1.45;
  const pinZ = mini ? 0.56 : 1.25;

  return (
    <>
      <mesh castShadow receiveShadow>
        <boxGeometry args={body as [number, number, number]} />
        <meshStandardMaterial color="#211609" metalness={0.86} roughness={0.2} emissive="#4a2104" emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[0, mini ? -0.2 : -0.34, 0]}>
        <boxGeometry args={glow as [number, number, number]} />
        <meshStandardMaterial color="#5e2106" emissive="#ffb13d" emissiveIntensity={1.25} toneMapped={false} roughness={0.32} />
      </mesh>
      {Array.from({ length: mini ? 10 : 34 }).map((_, index) => (
        <mesh
          key={`mosaic-${index}`}
          position={[
            (seededRandom(index * 4.7) - 0.5) * (mini ? 1.1 : 2.85),
            mini ? -0.06 : -0.08,
            (seededRandom(index * 8.2) - 0.5) * (mini ? 0.7 : 1.85),
          ]}
        >
          <boxGeometry args={[mini ? 0.11 : 0.2, mini ? 0.03 : 0.05, mini ? 0.08 : 0.13]} />
          <meshStandardMaterial color="#ffe39d" emissive="#ffbe45" emissiveIntensity={1.15} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[mini ? -0.18 : -0.72, mini ? 0.18 : 0.31, 0.03]} rotation={[0, 0, -0.48]}>
        <boxGeometry args={[mini ? 0.42 : 1.08, 0.045, 0.15]} />
        <meshStandardMaterial color="#fff2de" emissive="#ffb064" emissiveIntensity={0.42} toneMapped={false} />
      </mesh>
      <mesh position={[mini ? 0.08 : -0.27, mini ? 0.2 : 0.34, 0.03]} rotation={[0, 0, 0.48]}>
        <boxGeometry args={[mini ? 0.3 : 0.72, 0.045, 0.15]} />
        <meshStandardMaterial color="#fff2de" emissive="#ffb064" emissiveIntensity={0.42} toneMapped={false} />
      </mesh>
      {Array.from({ length: pins }).map((_, index) => (
        <mesh key={`pin-${index}`} position={[pinStart + (index % Math.ceil(pins / 2)) * pinStep, mini ? -0.05 : -0.09, index < pins / 2 ? -pinZ : pinZ]}>
          <boxGeometry args={[mini ? 0.07 : 0.11, mini ? 0.1 : 0.15, mini ? 0.2 : 0.36]} />
          <meshStandardMaterial color="#ff7a2a" emissive={accent} emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function RingModel({ accentBand = false }: { accentBand?: boolean }) {
  return (
    <group>
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.56, 0.09, 22, 96]} />
        <meshStandardMaterial color="#030303" metalness={0.98} roughness={0.12} envMapIntensity={2.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.02}>
        <torusGeometry args={[0.56, 0.012, 8, 96]} />
        <meshStandardMaterial color={accentBand ? accent : "#151515"} emissive={accentBand ? accent : "#000000"} emissiveIntensity={accentBand ? 1.6 : 0.1} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.74}>
        <torusGeometry args={[0.56, 0.009, 8, 96]} />
        <meshStandardMaterial color="#ffffff" emissive="#553018" emissiveIntensity={0.18} toneMapped={false} opacity={0.42} transparent />
      </mesh>
    </group>
  );
}

function HardwareStage({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const stage = useRef<THREE.Group>(null);
  const chip = useRef<THREE.Group>(null);
  const marketCluster = useRef<THREE.Group>(null);
  const platformCluster = useRef<THREE.Group>(null);
  const industryCluster = useRef<THREE.Group>(null);
  const ringField = useRef<THREE.Group>(null);
  const heroRings = useRef<THREE.Group>(null);
  const smoothProgress = useRef(0);

  const boardPlates = useMemo<BoardPlate[]>(() => [
    { x: -14, y: 7.8, width: 18, height: 6.2, angle: 0.2 },
    { x: 8.5, y: 8.4, width: 21, height: 6.6, angle: -0.16 },
    { x: -22, y: -4.5, width: 17, height: 5.2, angle: -0.1 },
    { x: 17, y: -5.6, width: 19, height: 6.1, angle: 0.18 },
    { x: 0, y: -12.2, width: 24, height: 5.8, angle: 0.04 },
  ], []);

  const traces = useMemo<Trace[]>(() => {
    const anchors = [
      [-24, -9], [-18, -5], [-14, 2], [-8, 6], [-3, -2], [3, 4],
      [9, -1], [14, 7], [18, -7], [24, 2], [29, -11], [-29, 8],
    ];
    const strong = anchors.flatMap(([x, y], index) => {
      const direction = index % 3 === 0 ? 0 : index % 3 === 1 ? 0.64 : -0.64;
      return [
        { x, y, length: 18 + (index % 4) * 3, width: 0.045, angle: direction },
        { x: x + 4.6, y: y + 2.25, length: 13 + (index % 5) * 2.3, width: 0.034, angle: direction },
        { x: x - 5.2, y: y - 2.1, length: 9 + (index % 6) * 2.1, width: 0.026, angle: direction + (index % 2 ? 0.55 : -0.55) },
      ];
    });
    const hairlines = Array.from({ length: 72 }, (_, index) => ({
      angle: (seededRandom(index * 2.71) - 0.5) * 0.18 + (index % 2 ? 0.58 : -0.58),
      length: 7 + seededRandom(index * 5.43) * 18,
      x: (seededRandom(index * 9.91) - 0.5) * 78,
      y: (seededRandom(index * 4.19) - 0.5) * 38,
      width: 0.012 + seededRandom(index * 7.2) * 0.018,
    }));
    return [...strong, ...hairlines];
  }, []);

  const nodes = useMemo(() => {
    return Array.from({ length: 54 }, (_, index) => ({
      x: (seededRandom(index * 3.2) - 0.5) * 72,
      y: (seededRandom(index * 8.4) - 0.5) * 36,
      s: 0.035 + seededRandom(index * 6.1) * 0.055,
    }));
  }, []);

  const rings = useMemo<RingSeed[]>(() => {
    return Array.from({ length: 28 }, (_, index) => ({
      x: (seededRandom(index * 6.13) - 0.5) * 28,
      y: 0.15 + seededRandom(index * 2.41) * 0.12,
      z: (seededRandom(index * 9.17) - 0.5) * 18,
      scale: 0.18 + seededRandom(index * 3.77) * 0.48,
      rx: -Math.PI / 2 + (seededRandom(index * 5.21) - 0.5) * 0.9,
      ry: (seededRandom(index * 8.02) - 0.5) * 1.4,
      rz: seededRandom(index * 4.44) * Math.PI,
    }));
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    smoothProgress.current = THREE.MathUtils.damp(smoothProgress.current, progressRef.current, 6.4, delta);
    const progress = smoothProgress.current;
    const section = progress * (sectionIds.length - 1);
    const aboutShift = clamp(section);
    const marketsShift = clamp(section - 1);
    const objectX = lerp(-2.7, 1.4, aboutShift);
    const objectY = lerp(1.85, 1.72, marketsShift);
    const objectZ = lerp(-0.9, -1.65, aboutShift);
    if (stage.current) {
      stage.current.rotation.x = -1.12 + progress * 0.18;
      stage.current.rotation.z = -0.2 + Math.sin(t * 0.08) * 0.018 + progress * 0.16;
      stage.current.position.y = -3.24 - progress * 0.18;
      stage.current.position.z = -8.8 + progress * 2.8;
    }
    if (ringField.current) {
      ringField.current.rotation.z = -0.09 + progress * 0.18 + Math.sin(t * 0.08) * 0.012;
      ringField.current.position.z = -1.8 + progress * 0.9;
    }
    if (heroRings.current) {
      heroRings.current.rotation.y = -0.34 + Math.sin(t * 0.18) * 0.08 + progress * 0.4;
      heroRings.current.rotation.z = -0.16 + Math.sin(t * 0.12) * 0.05;
      heroRings.current.position.x = lerp(-2.15, 1.15, aboutShift);
      heroRings.current.position.y = lerp(2.55, 2.05, clamp(section - 1));
      heroRings.current.visible = section < 4.8;
    }
    if (chip.current) {
      chip.current.visible = section < 1.48;
      chip.current.position.x = objectX;
      chip.current.position.y = objectY + Math.sin(t * 0.42) * 0.045;
      chip.current.position.z = objectZ;
      chip.current.rotation.x = -0.08 + Math.sin(t * 0.22) * 0.012;
      chip.current.rotation.z = lerp(-0.3, 0.1, aboutShift);
      chip.current.rotation.y = lerp(-0.58, -0.1, aboutShift);
      chip.current.scale.setScalar(lerp(1.04, 1.24, aboutShift));
    }
    if (marketCluster.current) {
      marketCluster.current.visible = section >= 1.55 && section < 3.05;
      marketCluster.current.rotation.y = -0.22 + Math.sin(t * 0.12) * 0.02;
      marketCluster.current.rotation.z = -0.18 + marketsShift * 0.12;
      marketCluster.current.position.y = 2.03 + Math.sin(t * 0.32) * 0.035;
    }
    if (platformCluster.current) {
      platformCluster.current.visible = section >= 2.55 && section < 4.18;
      platformCluster.current.rotation.y = -0.12 + Math.sin(t * 0.14) * 0.03;
      platformCluster.current.position.y = 1.78 + Math.sin(t * 0.25) * 0.035;
    }
    if (industryCluster.current) {
      industryCluster.current.visible = section >= 3.55 && section < 5.05;
      industryCluster.current.rotation.z = -0.12 + Math.sin(t * 0.1) * 0.02;
      industryCluster.current.position.y = 1.74 + Math.sin(t * 0.22) * 0.04;
    }
  });

  return (
    <group>
      <group ref={stage} position={[0, -3.18, -8.5]} rotation={[-1.09, 0, -0.08]}>
        <mesh receiveShadow>
          <planeGeometry args={[74, 44]} />
          <meshStandardMaterial color="#100501" emissive="#1d0701" emissiveIntensity={0.34} metalness={0.28} roughness={0.5} />
        </mesh>

        {boardPlates.map((plate, index) => (
          <mesh key={`plate-${index}`} position={[plate.x, plate.y, 0.032]} rotation={[0, 0, plate.angle]}>
            <boxGeometry args={[plate.width, plate.height, 0.02]} />
            <meshStandardMaterial color="#070200" emissive="#210801" emissiveIntensity={0.26} metalness={0.38} roughness={0.62} />
          </mesh>
        ))}

        {traces.map((trace, index) => (
          <mesh key={`trace-${index}`} position={[trace.x, trace.y, 0.055]} rotation={[0, 0, trace.angle]}>
            <boxGeometry args={[trace.length, trace.width, 0.022]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={index < 36 ? 1.2 : 0.68} toneMapped={false} />
          </mesh>
        ))}

        {nodes.map((node, index) => (
          <mesh key={`node-${index}`} position={[node.x, node.y, 0.075]}>
            <cylinderGeometry args={[node.s, node.s, 0.03, 18]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <group ref={ringField} position={[0, -2.95, -2.1]} rotation={[-1.08, 0, -0.09]}>
        {rings.map((ring, index) => (
          <group
            key={`scattered-ring-${index}`}
            position={[ring.x, ring.y, ring.z]}
            rotation={[ring.rx, ring.ry, ring.rz]}
            scale={ring.scale}
          >
            <RingModel accentBand={index % 6 === 0} />
          </group>
        ))}
      </group>

      <group ref={heroRings} position={[-2.15, 2.55, -1.05]} rotation={[0.2, -0.34, -0.16]}>
        <group position={[-1.35, 0.3, -0.65]} rotation={[0.25, -0.1, -0.35]} scale={0.72}>
          <RingModel accentBand />
        </group>
        <group position={[0.15, -0.08, 0.2]} rotation={[-0.2, 0.32, 0.24]} scale={0.5}>
          <RingModel />
        </group>
        <group position={[1.18, 0.18, -0.2]} rotation={[0.1, -0.38, 0.52]} scale={0.62}>
          <RingModel accentBand />
        </group>
      </group>

      <group ref={chip} position={[-2.65, 2.58, -1.25]} rotation={[0, -0.1, -0.1]}>
        <ChipModel />
      </group>

      <group ref={marketCluster} position={[-0.75, 2.03, -2.45]} rotation={[0, -0.2, -0.18]} scale={0.82} visible={false}>
        {[
          [-1.35, 0.02, -0.55],
          [0.3, 0.2, -0.62],
          [-0.35, -0.18, 0.62],
        ].map((position, index) => (
          <group key={`market-chip-${index}`} position={position as [number, number, number]} rotation={[0, index * 0.25, index * 0.08]}>
            <ChipModel mini />
          </group>
        ))}
        <group position={[1.1, 0.24, 0.45]} rotation={[0.2, -0.3, 0.45]} scale={0.38}>
          <RingModel accentBand />
        </group>
        <group position={[-1.95, 0.06, 0.4]} rotation={[-0.3, 0.12, -0.25]} scale={0.3}>
          <RingModel />
        </group>
      </group>

      <group ref={platformCluster} position={[1.08, 1.78, -2.35]} rotation={[0, -0.15, -0.08]} scale={0.68} visible={false}>
        {[
          [-1.6, 0.18, -0.7],
          [-0.55, 0.36, -0.35],
          [0.55, 0.22, -0.25],
          [1.55, 0.06, -0.55],
          [-1.18, -0.44, 0.35],
          [0, -0.28, 0.35],
          [1.12, -0.38, 0.22],
          [-0.42, -0.82, 1.02],
        ].map((position, index) => (
          <group key={`platform-chip-${index}`} position={position as [number, number, number]} rotation={[0, index * 0.08, index * 0.06]}>
            <ChipModel mini />
          </group>
        ))}
        {[
          [-2.0, 0.2, 0.86],
          [-0.3, 0.52, -0.9],
          [1.9, -0.04, 0.45],
        ].map((position, index) => (
          <group key={`platform-ring-${index}`} position={position as [number, number, number]} rotation={[0.25, index * 0.4, -0.35 + index * 0.2]} scale={0.28 + index * 0.04}>
            <RingModel accentBand={index === 1} />
          </group>
        ))}
      </group>

      <group ref={industryCluster} position={[0.2, 1.74, -2.2]} rotation={[0, -0.24, -0.12]} scale={0.78} visible={false}>
        <group position={[-1.35, 0.1, 0]} rotation={[0, -0.2, -0.1]}>
          <ChipModel />
        </group>
        <group position={[1.55, -0.12, 0.18]} rotation={[0, 0.22, 0.04]}>
          <ChipModel />
        </group>
        <group position={[0.25, 0.5, -0.52]} rotation={[0.28, -0.45, 0.22]} scale={0.5}>
          <RingModel accentBand />
        </group>
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
          <span style={{ color: accent }}>.....</span>
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
    <header className="group fixed left-0 top-0 z-40 flex h-[88px] w-full items-center border-b border-white/10 bg-[#050505]/92 px-[3vw] backdrop-blur-sm">
      <a className="mr-auto flex items-center gap-3 text-[22px] font-bold uppercase tracking-[0.02em]" href="#top">
        <span className="grid h-5 w-9 grid-cols-3 gap-[1px]">
          {Array.from({ length: 9 }).map((_, index) => (
            <span className="h-[5px] w-[10px] rotate-45 bg-white" key={index} />
          ))}
        </span>
        Ping
      </a>
      <nav className="hidden items-center gap-9 text-[12px] uppercase tracking-[0.16em] md:flex">
        <a href="#top">Home</a>
        <a href="#about">What we do <span style={{ color: accent }}>▾</span></a>
        <a href="#markets">Markets</a>
        <a href="#platform">About</a>
        <a href="#why">Careers</a>
      </nav>
      <a className="ml-auto hidden border border-white/20 px-8 py-4 text-[12px] uppercase tracking-[0.25em] md:block" href="https://getping.today">
        Let&apos;s connect →
      </a>
      <a className="ml-auto text-[12px] uppercase tracking-[0.2em] md:hidden" href="#about">menu</a>
      <div className="pointer-events-none absolute left-0 top-[88px] hidden w-full border-b border-white/10 bg-[#050505]/96 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 md:block">
        <div className="mx-auto grid w-[76vw] max-w-[1110px] grid-cols-3 gap-10 py-10">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em] text-white">{group.title}</p>
              <div className="grid gap-4">
                {group.items.map(([title, body]) => (
                  <a className="grid grid-cols-[16px_1fr] gap-3 text-left" href="#markets" key={title}>
                    <span className="mt-1 h-2.5 w-2.5 border border-white/70" />
                    <span>
                      <span className="block text-[13px] font-bold uppercase tracking-[0.08em] text-white">{title}</span>
                      <span className="mt-1 block text-[13px] leading-5 text-white/58">{body}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

function ProgressRail({ active }: { active: number }) {
  const labels = ["start", "about", "markets", "trading on", "industry", "05"];

  return (
    <aside className="fixed right-[3vw] top-1/2 z-40 hidden -translate-y-1/2 md:block" data-nav-rail>
      <div className="absolute left-[78px] top-4 h-[462px] w-px bg-white/22" />
      {[4, 88, 172, 256, 340, 424].map((top, index) => (
        <div
          className="absolute left-[75px] h-[6px] w-[6px] rounded-full"
          key={top}
          style={{ top, background: active === index ? accent : "rgba(255,255,255,0.28)" }}
        />
      ))}
      <div className="flex flex-col gap-[55px]">
        {labels.map((label, index) => (
          <a
            className={`relative grid h-[29px] min-w-[80px] place-items-center border px-3 text-[10px] lowercase tracking-[0.1em] ${
              active === index ? "rounded-full border-white text-white" : "border-white/35 text-white"
            }`}
            href={`#${sectionIds[index]}`}
            key={label}
          >
            {label}
          </a>
        ))}
      </div>
    </aside>
  );
}

function HeroSection() {
  return (
    <header className="section relative min-h-screen pt-[88px]" id="top">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-[76vw] max-w-[1320px] flex-col justify-between py-[48px]">
        <div className="grid grid-cols-[42px_1fr] gap-5 pt-3 text-[11px] uppercase tracking-[0.18em] text-white/55 md:grid-cols-[54px_1fr]">
          <span>#</span>
          <span>01 / NFC identity system</span>
        </div>
        <h1 className="display-type ml-[19vw] max-w-none text-[44px] uppercase leading-[0.86] text-white md:text-[64px] lg:text-[70px]">
          <span className="block whitespace-nowrap">EMPOWERING NATIVE</span>
          <span className="block whitespace-nowrap md:ml-[18%]">DIGITAL IDENTITY<span style={{ color: accent }}>*</span></span>
        </h1>
        <div className="ml-auto w-full max-w-[490px] pb-1">
          <h2 className="mono-title text-[24px] uppercase leading-none">we are ping</h2>
          <p className="mt-5 text-[16px] leading-6 text-white">
            Ping! is a titanium NFC identity ring and profile layer for turning real-world meetings into remembered digital connections.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-5">
            <a className="button-raven is-solid" href="https://getping.today">Get Ping!</a>
            <a className="button-raven is-solid" href="#platform">Careers</a>
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
      <div className="mx-auto flex min-h-screen w-[76vw] max-w-[1320px] items-center">
        <div className="w-full max-w-[442px]">
          <h2 className="mono-title text-[24px] uppercase leading-none">About us</h2>
          <p className="mt-5 text-[16px] leading-6 text-white">
            Ping! is an NFC-enabled smart ring designed purely for identity, portfolios, and bridging physical in-person connection to your digital trail.
          </p>
          <p className="mt-5 text-[16px] leading-6 text-white">
            Built after the rise of AI made digital interactions feel less human, Ping! turns a real-world moment into one clean profile tap.
          </p>
          <div className="mt-16 text-[12px] uppercase tracking-[0.2em] text-white/55">
            Invested by
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-14 text-[15px] font-bold uppercase tracking-[0.08em] text-white/80">
            {proofLogos.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketsSection() {
  return (
    <section className="section min-h-screen pt-[88px]" id="markets">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-[76vw] max-w-[1320px] flex-col justify-end pb-[8vh] pt-[16vh]">
        <div className="mb-auto ml-auto max-w-[620px] pt-[11vh] text-right">
          <h2 className="mono-title text-[24px] uppercase leading-none">Markets we operate in</h2>
          <p className="mt-5 text-[16px] leading-6 text-white">Continuously mapping identity moments across physical and digital networks.</p>
        </div>
        <div className="grid border-y border-white/14 bg-black/20 backdrop-blur-[1px] md:grid-cols-3">
          {marketCards.map(([number, title, body]) => (
            <article className="min-h-[286px] border-b border-white/14 p-8 md:border-b-0 md:border-r last:md:border-r-0" key={title}>
              <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: accent }}>{number}</p>
              <h3 className="display-type mt-6 text-[38px] uppercase leading-[0.95] text-white md:text-[46px]">
                {title.split(" ").map((word) => (
                  <span className="block" key={word}>{word}</span>
                ))}
              </h3>
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
    <section className="section min-h-screen pt-[88px]" id="platform">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-[76vw] max-w-[1320px] flex-col justify-center pb-[5vh]">
        <div className="max-w-[460px]">
          <h2 className="mono-title text-[24px] uppercase leading-none">Trading on</h2>
          <p className="mt-5 text-[16px] leading-6 text-white">
            Operational across the places where connections happen, Ping is uniquely equipped to turn every room into a remembered network.
          </p>
          <div className="mt-14 grid grid-cols-2 gap-10 text-[12px] uppercase tracking-[0.18em] text-white/45">
            <span>Audited by<br /><b className="mt-4 block text-[18px] tracking-[0.04em] text-white">Ping Security</b></span>
            <span>Trading on<br /><b className="mt-4 block text-[18px] tracking-[0.04em] text-white">Tap Network</b></span>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-3 items-center gap-x-9 gap-y-8 text-white md:grid-cols-6">
          {exchangeLogos.map((item, index) => (
            <div className={`text-center font-black tracking-tight ${index % 5 === 0 ? "text-[26px]" : "text-[20px]"}`} key={item}>
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
    <section className="section relative min-h-screen pt-[88px]" id="industry">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-[76vw] max-w-[1320px] items-center">
        <div className="-ml-[28vw] max-w-[560px]">
          <h2 className="display-type text-[42px] uppercase leading-none text-white md:text-[48px]">Powering the I3578118</h2>
          <p className="mt-8 max-w-[420px] text-[16px] leading-7 text-white">
            Wide, competitive, and uninterrupted coverage of identity exchange across high-density rooms.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0">
          {industryPills.map((item, index) => (
            <div
              className="absolute min-w-[166px] border border-white/22 bg-black/30 px-8 py-4 text-center text-[22px] font-black lowercase tracking-[0.02em] text-white backdrop-blur-[2px]"
              key={item}
              style={{
                left: `${23 + (index % 4) * 16.4}%`,
                top: `${29 + Math.floor(index / 4) * 20 + (index % 2) * 6}%`,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="section min-h-screen pt-[88px]" id="why">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-[98vw] flex-col justify-start pt-[2vh]">
        <div className="rounded-[4px] px-[4vw] py-[11vh] text-white" style={{ background: accent }}>
          <div className="mb-[17vh] flex items-start justify-between">
            <h2 className="display-type text-[72px] uppercase leading-none text-white/35 md:text-[104px]">Why us?</h2>
            <div className="grid h-16 w-16 place-items-center border border-white/25 text-2xl text-white/45">◊</div>
          </div>
        <div className="mx-auto grid max-w-[1320px] gap-16 md:grid-cols-3">
          {whyCards.map(([title, body]) => (
            <article className="p-2" key={title}>
              <h3 className="mono-title text-[28px] uppercase leading-none text-white">{title}</h3>
              <p className="mt-8 text-[16px] leading-7 text-white">{body}</p>
            </article>
          ))}
        </div>
        </div>
        <div className="mt-20 grid items-center gap-10 border-t border-white/12 pt-12 md:grid-cols-[0.44fr_0.56fr]">
          <div className="aspect-[4/3] border border-white/12 bg-[linear-gradient(135deg,rgba(255,77,22,0.42),rgba(255,255,255,0.06)_38%,rgba(0,0,0,0.2))]" />
          <div>
            <p className="mono-title text-[24px] uppercase leading-none">Careers</p>
            <h2 className="mono-title mt-10 text-[24px] uppercase leading-none">working at ping</h2>
            <p className="mt-6 text-[28px] font-bold uppercase leading-[1.05] md:text-[42px]">
              Your ambition is physical, digital, and hard to ignore?
            </p>
            <p className="mt-6 text-[16px] leading-6 text-white/72">
              We are building the first identity wearable for people who still believe the room matters. Join the hardware, product, and community work behind it.
            </p>
            <a className="button-raven mt-8 max-w-[260px]" href="https://getping.today">Explore opportunities</a>
            <blockquote className="mt-12 border-l border-white/20 pl-6 text-[16px] leading-6 text-white/72">
              “Connection is not stressful...”<br />
              <span className="mt-3 block text-[12px] uppercase tracking-[0.16em] text-white/45">Ping team, 2026</span>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black px-8 py-12 text-white">
      <div className="mx-auto grid w-[82vw] max-w-[1180px] gap-8 md:w-[76vw] md:grid-cols-[0.5fr_0.25fr_0.25fr]">
        <p className="max-w-xl text-[16px] leading-6 text-white/75">
          Our mission is to bridge physical connection and digital identity. Ping! is built for identity, portfolios, and real-world network intelligence.
        </p>
        <div className="text-[12px] uppercase tracking-[0.16em] text-white/60">What we do<br />Markets<br />Industry</div>
        <div className="text-[12px] uppercase tracking-[0.16em] text-white/60">About<br />Why us?<br />Contact<br /><br />designed + developed by Ping Ring Inc.</div>
      </div>
      <div className="mx-auto mt-12 flex w-[82vw] max-w-[1180px] justify-between border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.16em] text-white/45 md:w-[76vw]">
        <span>© Ping Ring Inc. 2026</span>
        <span>Tap identity network</span>
      </div>
    </footer>
  );
}

export function PingStorePage(_: PingStorePageProps) {
  const { active, progressRef } = useScrollState();
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
      <CircuitScene onReady={() => setReady(true)} progressRef={progressRef} />
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
        .section { scroll-snap-align: start; scroll-snap-stop: always; overflow: hidden; }
        .display-type {
          font-family: Monaco, "Lucida Console", "Andale Mono", ui-monospace, monospace;
          letter-spacing: 0;
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
