import { AdaptiveDpr, Environment, PerspectiveCamera, Preload, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PingStorePageProps = {
  variant?: "fluid";
};

const accent = "#ff4d16";
const pcbTexturePath = "/assets/raven/chip2.webp";
const squaresTexturePath = "/assets/raven/squares.webp";
const ravenModelPath = "/assets/raven/models/raven_circuit_engraved_latest.glb";
const plasticNormalPath = "/assets/raven/textures/plastic/512-black_plastic_normal.webp";
const plasticAoPath = "/assets/raven/textures/plastic/1K-black_plastic_ambientocclusion.webp";
const plasticRoughnessPath = "/assets/raven/textures/plastic/1K-black_plastic_roughness.webp";
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

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
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

type CameraTransform = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

function HardwareStage({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { scene } = useGLTF(ravenModelPath);
  const { camera } = useThree();
  const [squaresMap, pcbMap, normalMap, aoMap, roughnessMap] = useLoader(THREE.TextureLoader, [
    squaresTexturePath,
    pcbTexturePath,
    plasticNormalPath,
    plasticAoPath,
    plasticRoughnessPath,
  ]);
  const smoothProgress = useRef(0);
  const tempPosition = useMemo(() => new THREE.Vector3(), []);
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);

  useLayoutEffect(() => {
    [squaresMap, normalMap, aoMap, roughnessMap].forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 8;
    });
    squaresMap.colorSpace = THREE.SRGBColorSpace;
    squaresMap.repeat.set(1.4, 1.4);
    pcbMap.colorSpace = THREE.SRGBColorSpace;
    pcbMap.flipY = false;
    pcbMap.anisotropy = 8;
    normalMap.repeat.set(50, 50);
    aoMap.repeat.set(50, 50);
    roughnessMap.repeat.set(50, 50);
  }, [aoMap, normalMap, pcbMap, roughnessMap, squaresMap]);

  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    color: "#ff7a1a",
    depthWrite: false,
    map: squaresMap,
    toneMapped: false,
    transparent: true,
    opacity: 1,
  }), [squaresMap]);

  const planeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    color: "#ff4d16",
    depthWrite: false,
    map: pcbMap,
    toneMapped: false,
    transparent: true,
    opacity: 0.72,
  }), [pcbMap]);

  const plasticMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    aoMap,
    color: "#050403",
    emissive: "#180801",
    emissiveIntensity: 0.22,
    metalness: 0.62,
    normalMap,
    roughness: 0.58,
    roughnessMap,
  }), [aoMap, normalMap, roughnessMap]);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.frustumCulled = false;
      if (child.name.startsWith("Camera")) {
        child.visible = false;
      } else if (child.name.includes("GlowBox")) {
        child.material = glowMaterial;
      } else if (child.name === "Plane") {
        child.material = planeMaterial;
      } else {
        child.material = plasticMaterial;
      }
    });
    return clone;
  }, [glowMaterial, planeMaterial, plasticMaterial, scene]);

  const cameraTransforms = useMemo<CameraTransform[]>(() => {
    model.updateMatrixWorld(true);
    const transforms: Array<CameraTransform & { name: string }> = [];
    model.traverse((child) => {
      if (!child.name.startsWith("Camera")) return;
      transforms.push({
        name: child.name,
        position: child.getWorldPosition(new THREE.Vector3()),
        quaternion: child.getWorldQuaternion(new THREE.Quaternion()),
      });
    });
    return transforms
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      .map(({ position, quaternion }) => ({ position, quaternion }));
  }, [model]);

  useFrame((_, delta) => {
    if (!cameraTransforms.length) return;
    smoothProgress.current = THREE.MathUtils.damp(smoothProgress.current, progressRef.current, 5.8, delta);
    const scaled = smoothProgress.current * (cameraTransforms.length - 1);
    const index = Math.min(cameraTransforms.length - 2, Math.max(0, Math.floor(scaled)));
    const nextIndex = Math.min(cameraTransforms.length - 1, index + 1);
    const localProgress = scaled - index;
    const current = cameraTransforms[index];
    const next = cameraTransforms[nextIndex];
    tempPosition.copy(current.position).lerp(next.position, localProgress);
    tempQuaternion.copy(current.quaternion).slerp(next.quaternion, localProgress);
    camera.position.copy(tempPosition);
    camera.quaternion.copy(tempQuaternion);
  });

  return (
    <primitive object={model} />
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
