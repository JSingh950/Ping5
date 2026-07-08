import { AdaptiveDpr, Environment, PerspectiveCamera, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

type NodeSeed = {
  s: number;
  x: number;
  y: number;
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
        <AdaptiveDpr />
        <Environment preset="night" />
        <Preload all />
      </Canvas>
    </div>
  );
}

function PingChip({ size = "large" }: { size?: "hero" | "large" | "mini" }) {
  const isHero = size === "hero";
  const isMini = size === "mini";
  const body: [number, number, number] = isHero ? [4.6, 0.56, 3.1] : isMini ? [1.55, 0.3, 1.08] : [2.55, 0.42, 1.72];
  const glow: [number, number, number] = [body[0] * 1.03, body[1] * 0.62, body[2] * 1.03];
  const topY = body[1] / 2 + 0.016;
  const pinCount = isMini ? 5 : isHero ? 15 : 9;
  const pinStep = body[0] / (pinCount + 1);

  return (
    <group>
      <mesh position={[0, -body[1] * 0.42, 0]}>
        <boxGeometry args={glow} />
        <meshBasicMaterial color="#ffb445" toneMapped={false} transparent opacity={0.72} />
      </mesh>
      <mesh>
        <boxGeometry args={body} />
        <meshStandardMaterial color="#0b0805" metalness={0.72} roughness={0.24} emissive="#2f1003" emissiveIntensity={0.26} />
      </mesh>
      <mesh position={[0, topY, 0]}>
        <boxGeometry args={[body[0] * 0.86, 0.018, body[2] * 0.74]} />
        <meshStandardMaterial color="#1a1108" metalness={0.9} roughness={0.17} emissive="#160702" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, topY + 0.018, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[isMini ? 0.28 : 0.46, isMini ? 0.28 : 0.46, 0.018, 6]} />
        <meshBasicMaterial color="#ffdd92" toneMapped={false} transparent opacity={0.82} />
      </mesh>
      {[-0.34, 0, 0.34].map((offset) => (
        <mesh key={`chip-mark-${offset}`} position={[offset * body[0] * 0.25, topY + 0.036, 0]} rotation={[0, 0, -0.45]}>
          <boxGeometry args={[isMini ? 0.34 : 0.56, 0.018, isMini ? 0.06 : 0.1]} />
          <meshBasicMaterial color="#fff3cf" toneMapped={false} />
        </mesh>
      ))}
      {Array.from({ length: pinCount }).map((_, index) => {
        const x = -body[0] / 2 + (index + 1) * pinStep;
        return (
          <group key={`pin-row-${index}`}>
            <mesh position={[x, -body[1] * 0.22, body[2] / 2 + 0.16]}>
              <boxGeometry args={[isMini ? 0.08 : 0.12, isMini ? 0.1 : 0.16, isMini ? 0.22 : 0.38]} />
              <meshBasicMaterial color="#ff7a24" toneMapped={false} />
            </mesh>
            <mesh position={[x, -body[1] * 0.22, -body[2] / 2 - 0.16]}>
              <boxGeometry args={[isMini ? 0.08 : 0.12, isMini ? 0.1 : 0.16, isMini ? 0.22 : 0.38]} />
              <meshBasicMaterial color="#ff7a24" toneMapped={false} />
            </mesh>
          </group>
        );
      })}
      {Array.from({ length: isHero ? 24 : isMini ? 6 : 12 }).map((_, index) => (
        <mesh
          key={`chip-window-${index}`}
          position={[
            (seededRandom(index * 4.7) - 0.5) * body[0] * 0.82,
            -body[1] * 0.36,
            (seededRandom(index * 8.2) - 0.5) * body[2] * 0.72,
          ]}
        >
          <boxGeometry args={[isMini ? 0.08 : 0.16, isMini ? 0.032 : 0.048, isMini ? 0.06 : 0.11]} />
          <meshBasicMaterial color="#ffe099" toneMapped={false} transparent opacity={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function PingRing({ accentBand = false }: { accentBand?: boolean }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.56, 0.09, 16, 60]} />
        <meshStandardMaterial color="#020202" metalness={1} roughness={0.1} envMapIntensity={2.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.02}>
        <torusGeometry args={[0.56, 0.012, 8, 60]} />
        <meshBasicMaterial color={accentBand ? accent : "#252525"} toneMapped={false} transparent opacity={accentBand ? 0.84 : 0.46} />
      </mesh>
    </group>
  );
}

function InstancedTraces({ traces, opacity, z }: { opacity: number; traces: Trace[]; z: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Euler(0, 0, 0);
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    traces.forEach((trace, index) => {
      rotation.z = trace.angle;
      quaternion.setFromEuler(rotation);
      scale.set(trace.length, trace.width, 0.024);
      matrix.compose(new THREE.Vector3(trace.x, trace.y, z), quaternion, scale);
      ref.current?.setMatrixAt(index, matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [traces, z]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, traces.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={opacity} />
    </instancedMesh>
  );
}

function InstancedNodes({ nodes }: { nodes: NodeSeed[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    nodes.forEach((node, index) => {
      matrix.compose(new THREE.Vector3(node.x, node.y, 0.078), quaternion, new THREE.Vector3(node.s, node.s, 0.03));
      ref.current?.setMatrixAt(index, matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, nodes.length]} frustumCulled={false}>
      <cylinderGeometry args={[1, 1, 1, 18]} />
      <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.86} />
    </instancedMesh>
  );
}

function InstancedRings({ rings }: { rings: RingSeed[] }) {
  const shell = useRef<THREE.InstancedMesh>(null);
  const glints = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    rings.forEach((ring, index) => {
      rotation.set(ring.rx, ring.ry, ring.rz);
      quaternion.setFromEuler(rotation);
      scale.setScalar(ring.scale);
      matrix.compose(new THREE.Vector3(ring.x, ring.y, ring.z), quaternion, scale);
      shell.current?.setMatrixAt(index, matrix);
      glints.current?.setMatrixAt(index, matrix);
    });
    if (shell.current) shell.current.instanceMatrix.needsUpdate = true;
    if (glints.current) glints.current.instanceMatrix.needsUpdate = true;
  }, [rings]);

  return (
    <>
      <instancedMesh ref={shell} args={[undefined, undefined, rings.length]} frustumCulled={false}>
        <torusGeometry args={[0.56, 0.09, 14, 44]} />
        <meshStandardMaterial color="#030303" metalness={0.98} roughness={0.14} envMapIntensity={1.7} />
      </instancedMesh>
      <instancedMesh ref={glints} args={[undefined, undefined, rings.length]} frustumCulled={false} scale={1.02}>
        <torusGeometry args={[0.56, 0.011, 8, 44]} />
        <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.28} />
      </instancedMesh>
    </>
  );
}

function HardwareStage({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const world = useRef<THREE.Group>(null);
  const heroChip = useRef<THREE.Group>(null);
  const aboutChip = useRef<THREE.Group>(null);
  const marketChips = useRef<THREE.Group>(null);
  const tradingGrid = useRef<THREE.Group>(null);
  const ringsGroup = useRef<THREE.Group>(null);
  const smoothProgress = useRef(0);

  const boardPlates = useMemo<BoardPlate[]>(() => [
    { x: -22, y: 7, width: 25, height: 7.6, angle: 0.12 },
    { x: 4, y: 6.8, width: 28, height: 7.2, angle: -0.08 },
    { x: 27, y: -3.8, width: 22, height: 6.4, angle: 0.14 },
    { x: -20, y: -8.8, width: 26, height: 6.8, angle: -0.12 },
    { x: 1, y: -15.6, width: 31, height: 6.2, angle: 0.04 },
  ], []);

  const traces = useMemo(() => {
    const strong: Trace[] = [];
    const fine: Trace[] = [];
    const add = (target: Trace[], x: number, y: number, length: number, angle: number, width: number) => {
      target.push({ x, y, length, angle, width });
    };
    const route = (target: Trace[], sx: number, sy: number, ex: number, ey: number, lane: number, width: number) => {
      const midX = sx + (ex - sx) * 0.5 + lane;
      add(target, (sx + midX) / 2, sy, Math.abs(midX - sx), 0, width);
      add(target, midX, (sy + ey) / 2, Math.abs(ey - sy), Math.PI / 2, width);
      add(target, (midX + ex) / 2, ey, Math.abs(ex - midX), 0, width);
      add(target, sx + lane * 1.8, sy + lane * 0.18, Math.abs(lane) * 3.2, lane > 0 ? 0.68 : -0.68, width * 0.72);
    };

    [
      [-14, 1.4, -41, 8.4, -2.8],
      [-13, -0.2, -42, -4.8, 2.5],
      [-10, -2.2, -33, -17, -1.7],
      [-6, 2.8, -1, 19, 2.2],
      [-2, 0.6, 35, 8.8, -2.9],
      [2.5, -1.2, 41, -7.6, 2.8],
      [7.6, 2.2, 26, 18.4, -1.9],
      [10, -3.5, 33, -18.5, 2.2],
      [14, 1.2, 43, 2.4, -2.4],
      [-3, -5.5, -38, -11, 1.9],
    ].forEach(([sx, sy, ex, ey, lane], index) => route(strong, sx, sy, ex, ey, lane, index % 2 ? 0.058 : 0.047));

    for (let index = 0; index < 88; index += 1) {
      const row = index % 9;
      const family = index % 5;
      const angle = family === 0 ? Math.PI / 2 : family === 1 ? 0.58 : family === 2 ? -0.58 : 0;
      add(
        fine,
        (seededRandom(index * 9.91) - 0.5) * 88,
        -21 + row * 5.4 + (seededRandom(index * 3.1) - 0.5) * 1.2,
        7 + seededRandom(index * 5.43) * 21,
        angle,
        0.012 + seededRandom(index * 7.2) * 0.012,
      );
    }

    return { fine, strong };
  }, []);

  const nodes = useMemo<NodeSeed[]>(() => {
    const fixed: NodeSeed[] = [
      { x: -37, y: 8.4, s: 0.17 }, { x: -34, y: -4.8, s: 0.14 }, { x: -27, y: -17, s: 0.16 },
      { x: -1, y: 18.6, s: 0.14 }, { x: 30, y: 8.8, s: 0.18 }, { x: 37, y: -7.6, s: 0.15 },
      { x: 26, y: 18.2, s: 0.13 }, { x: 33, y: -18, s: 0.16 }, { x: 42, y: 2.4, s: 0.12 },
    ];
    const scattered = Array.from({ length: 52 }, (_, index) => ({
      x: (seededRandom(index * 3.2) - 0.5) * 86,
      y: (seededRandom(index * 8.4) - 0.5) * 42,
      s: 0.035 + seededRandom(index * 6.1) * 0.055,
    }));
    return [...fixed, ...scattered];
  }, []);

  const rings = useMemo<RingSeed[]>(() => {
    return Array.from({ length: 24 }, (_, index) => ({
      x: (seededRandom(index * 6.13) - 0.5) * 34,
      y: 0.15 + seededRandom(index * 2.41) * 0.12,
      z: (seededRandom(index * 9.17) - 0.5) * 23,
      scale: 0.16 + seededRandom(index * 3.77) * 0.38,
      rx: -Math.PI / 2 + (seededRandom(index * 5.21) - 0.5) * 0.9,
      ry: (seededRandom(index * 8.02) - 0.5) * 1.4,
      rz: seededRandom(index * 4.44) * Math.PI,
    }));
  }, []);

  const miniChipPositions = useMemo<[number, number, number][]>(() => [
    [-2.2, 0.25, -0.9],
    [-0.8, 0.36, -0.5],
    [0.7, 0.26, -0.7],
    [2.0, 0.2, -1.05],
    [-1.7, -0.42, 0.25],
    [-0.25, -0.28, 0.38],
    [1.2, -0.36, 0.14],
    [0.25, -0.8, 0.95],
  ], []);

  useFrame((_, delta) => {
    const t = performance.now() * 0.001;
    smoothProgress.current = THREE.MathUtils.damp(smoothProgress.current, progressRef.current, 6.4, delta);
    const progress = smoothProgress.current;
    const section = progress * (sectionIds.length - 1);
    const aboutShift = clamp(section);
    const marketsShift = clamp(section - 1);

    if (world.current) {
      world.current.rotation.x = -1.02 + progress * 0.12;
      world.current.rotation.z = -0.16 + progress * 0.22 + Math.sin(t * 0.08) * 0.012;
      world.current.position.x = lerp(0, -0.42, marketsShift);
      world.current.position.y = -2.35 - progress * 0.08;
      world.current.position.z = -8.1 + progress * 2.25;
    }
    if (ringsGroup.current) {
      ringsGroup.current.rotation.z = -0.12 + progress * 0.22;
      ringsGroup.current.position.z = -2.1 + progress * 1.05;
    }
    if (heroChip.current) {
      heroChip.current.visible = section < 1.25;
      heroChip.current.position.x = lerp(-3.1, -0.7, aboutShift);
      heroChip.current.position.y = 1.52 + Math.sin(t * 0.28) * 0.025;
      heroChip.current.position.z = lerp(-0.8, -1.9, aboutShift);
      heroChip.current.rotation.y = lerp(-0.52, -0.2, aboutShift);
      heroChip.current.rotation.z = lerp(-0.24, -0.02, aboutShift);
      heroChip.current.scale.setScalar(1.08);
    }
    if (aboutChip.current) {
      aboutChip.current.visible = section >= 0.75 && section < 2.1;
      aboutChip.current.position.x = lerp(1.25, 2.15, clamp(section - 0.75));
      aboutChip.current.rotation.z = 0.12 + Math.sin(t * 0.12) * 0.02;
    }
    if (marketChips.current) {
      marketChips.current.visible = section >= 1.55 && section < 3.15;
      marketChips.current.rotation.y = -0.18 + Math.sin(t * 0.1) * 0.018;
      marketChips.current.rotation.z = -0.12 + marketsShift * 0.1;
    }
    if (tradingGrid.current) {
      tradingGrid.current.visible = section >= 2.55 && section < 4.25;
      tradingGrid.current.rotation.y = -0.12 + Math.sin(t * 0.12) * 0.02;
      tradingGrid.current.position.y = 1.64 + Math.sin(t * 0.2) * 0.028;
    }
  });

  return (
    <group>
      <group ref={world} position={[0, -2.35, -8.1]} rotation={[-1.02, 0, -0.16]}>
        <mesh>
          <planeGeometry args={[92, 52]} />
          <meshStandardMaterial color="#080301" emissive="#190701" emissiveIntensity={0.4} metalness={0.42} roughness={0.56} />
        </mesh>

        {boardPlates.map((plate, index) => (
          <mesh key={`plate-${index}`} position={[plate.x, plate.y, 0.034]} rotation={[0, 0, plate.angle]}>
            <boxGeometry args={[plate.width, plate.height, 0.02]} />
            <meshStandardMaterial color="#050201" emissive="#240801" emissiveIntensity={0.34} metalness={0.45} roughness={0.54} />
          </mesh>
        ))}

        <InstancedTraces traces={traces.strong} z={0.07} opacity={0.98} />
        <InstancedTraces traces={traces.fine} z={0.062} opacity={0.62} />
        <InstancedNodes nodes={nodes} />
      </group>

      <group ref={ringsGroup} position={[0, -2.84, -2.1]} rotation={[-1.02, 0, -0.12]}>
        <InstancedRings rings={rings} />
      </group>

      <group ref={heroChip} position={[-3.1, 1.52, -0.8]} rotation={[0.03, -0.52, -0.24]}>
        <PingChip size="hero" />
      </group>

      <group ref={aboutChip} position={[1.25, 1.42, -2.05]} rotation={[0.02, -0.24, 0.12]} scale={1.08} visible={false}>
        <PingChip size="large" />
      </group>

      <group ref={marketChips} position={[-0.85, 1.82, -2.55]} rotation={[0.02, -0.18, -0.12]} scale={0.88} visible={false}>
        {[
          [-1.3, 0.22, -0.42],
          [0.2, -0.02, 0.08],
          [1.44, 0.18, -0.35],
        ].map((position, index) => (
          <group key={`market-chip-${index}`} position={position as [number, number, number]} rotation={[0, -0.04 + index * 0.18, -0.05 + index * 0.06]}>
            <PingChip size="large" />
          </group>
        ))}
      </group>

      <group ref={tradingGrid} position={[0.7, 1.64, -2.8]} rotation={[0, -0.12, -0.06]} scale={0.78} visible={false}>
        {miniChipPositions.map((position, index) => (
          <group key={`mini-chip-${index}`} position={position} rotation={[0, index * 0.08, index * 0.05]}>
            <PingChip size="mini" />
          </group>
        ))}
        <group position={[-2.4, 0.2, 0.65]} rotation={[0.25, -0.2, -0.35]} scale={0.36}>
          <PingRing accentBand />
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
