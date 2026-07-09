import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei/core/Environment.js";
import { useGLTF } from "@react-three/drei/core/Gltf.js";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera.js";
import { Preload } from "@react-three/drei/core/Preload.js";
import type { MutableRefObject } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type PingStorePageProps = {
  variant?: "fluid";
};

const accent = "#0f6f3d";
const pulseGreen = "#38ff8c";
const deepGreen = "#04150c";
const pcbTexturePath = "/assets/raven/chip2.webp";
const squaresTexturePath = "/assets/raven/squares.webp";
const circuitModelPath = "/assets/raven/models/raven_circuit_engraved_latest.glb";
const introVideoPath = "/assets/intro/hf_20260703_204546_cropped_16x9_enhanced.mp4";
const plasticNormalPath = "/assets/raven/textures/plastic/512-black_plastic_normal.webp";
const plasticAoPath = "/assets/raven/textures/plastic/1K-black_plastic_ambientocclusion.webp";
const plasticRoughnessPath = "/assets/raven/textures/plastic/1K-black_plastic_roughness.webp";
const sectionIds = ["top", "about", "markets", "platform", "industry", "why"];

const marketCards = [
  [
    "[ 01 ]",
    "Network Visualizer",
    "Turn your relationships into a living universe of circles, people, and context.",
  ],
  [
    "[ 02 ]",
    "Contact Memory",
    "Track how you met, organize contacts, and keep your professional network in motion.",
  ],
  [
    "[ 03 ]",
    "Team Workspaces",
    "Give teams shared visibility into warm leads, relationship health, and follow-up.",
  ],
];

const whyCards = [
  [
    "Human Connection",
    "Ping was founded on a simple belief: your network is your net worth, and you should be able to see it.",
  ],
  [
    "Network Control",
    "Visualize your circles, organize contacts, and keep relationship context where you can actually use it.",
  ],
  [
    "Fast Exchange",
    "The NFC ring turns a real-world meeting into a remembered profile, contact, and follow-up path in one tap.",
  ],
];

const navGroups = [
  {
    title: "Network App",
    items: [
      ["Network Universe", "Visualize circles, contacts, and relationship context."],
      ["Relationship Health", "Gentle reminders help you stay close to the people who matter."],
      ["Warm Intros", "See the paths through your network as Ping grows."],
    ],
  },
  {
    title: "Ping Ring",
    items: [
      ["NFC Tap", "Tap your ring to a phone and share your profile instantly."],
      ["First 1,000 Rings", "The first launch batch is built for early Ping communities."],
      ["$49.99 Launch", "Public ring purchase path shown on getping.today."],
    ],
  },
  {
    title: "Teams",
    items: [
      ["Shared Workspace", "Invite reps and get a team live without a migration."],
      ["Warm Lead Visibility", "See who is pinging who and where each relationship sits."],
      ["Tool Integrations", "Move people and context into the systems your team already uses."],
    ],
  },
];

const platformCells = [
  "network visualizer",
  "relationship health",
  "contact circles",
  "warm intros",
  "profile link",
  "contact import",
  "native NFC",
  "ping ring",
  "$49.99 launch",
  "no ring required",
  "team workspace",
  "tool integrations",
];

const proofLogos = ["First 1,000 rings", "$49.99 launch", "No ring required", "Teams demo"];

const exchangeLogos = [
  "Profile",
  "Circles",
  "Network Map",
  "Warm Intros",
  "Relationship Health",
  "Contact Import",
  "Notifications",
  "Leaderboard",
  "Team Workspace",
  "Integrations",
  "Invite Friends",
  "Share Profile",
  "LinkedIn",
  "Instagram",
  "Phone",
  "Email",
  "CSV",
  "Stripe",
];

const industryPills = [
  "profile",
  "circles",
  "network map",
  "warm intros",
  "relationship health",
  "team workspace",
  "integrations",
  "NFC ring",
];

const integrationPills = [
  "LinkedIn",
  "Instagram",
  "portfolio",
  "email",
  "phone",
  "contacts",
  "CSV",
];

const industryBands = [
  [
    "powering the network",
    "Visualize your circles, track relationship health, and keep context attached to every contact.",
  ],
  [
    "powering the ring",
    "Tap your Ping ring to share your profile and turn real-world meetings into remembered connections.",
  ],
  [
    "powering teams",
    "Shared workspaces help teams see warm leads, onboard reps, and connect the tools they already use.",
  ],
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function useScrollState() {
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = Math.max(1, window.innerHeight * (sectionIds.length - 1));
      const progress = clamp(window.scrollY / max);
      const nextActive = Math.min(
        sectionIds.length - 1,
        Math.max(0, Math.round(progress * (sectionIds.length - 1))),
      );
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

function CircuitScene({
  onReady,
  progressRef,
}: {
  onReady: () => void;
  progressRef: MutableRefObject<number>;
}) {
  return (
    <div className="fixed inset-0 z-0 h-screen w-screen bg-black">
      <Canvas
        className="h-full w-full"
        dpr={[1.5, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          precision: "highp",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.AgXToneMapping;
          gl.toneMappingExposure = 1.2;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFShadowMap;
          onReady();
        }}
      >
        <PerspectiveCamera makeDefault fov={36} position={[0.15, 3.6, 8.4]} />
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 7.5, 24]} />
        <ambientLight intensity={0.055} />
        <directionalLight castShadow color="#f2fff7" intensity={1.05} position={[4.5, 7, 5]} />
        <spotLight
          angle={0.42}
          castShadow
          color="#f7fff9"
          intensity={64}
          penumbra={0.82}
          position={[-3.6, 5.4, 4.2]}
        />
        <pointLight color={pulseGreen} intensity={0} distance={8} position={[-2.1, 1.1, 1.2]} />
        <pointLight color={accent} intensity={18} distance={12} position={[5, -1.2, -7]} />
        <HardwareStage progressRef={progressRef} />
        <BloomComposer />
        <Environment preset="night" />
        <Preload all />
      </Canvas>
      <div className="ethereal-glow pointer-events-none absolute inset-0" />
      <div className="ethereal-vignette pointer-events-none absolute inset-0" />
    </div>
  );
}

function BloomComposer() {
  const { camera, gl, scene, size } = useThree();
  const composer = useMemo(() => {
    const bloom = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.82, 0.42, 1.28);
    const nextComposer = new EffectComposer(gl);
    nextComposer.addPass(new RenderPass(scene, camera));
    nextComposer.addPass(bloom);
    return { bloom, composer: nextComposer };
  }, [camera, gl, scene, size.height, size.width]);

  useEffect(() => {
    composer.composer.setSize(size.width, size.height);
    composer.bloom.setSize(size.width, size.height);
  }, [composer, size.height, size.width]);

  useEffect(() => () => composer.composer.dispose(), [composer]);

  useFrame((_, delta) => {
    composer.bloom.strength = 0.82;
    composer.bloom.radius = 0.42;
    composer.bloom.threshold = 1.28;
    composer.composer.render(delta);
  }, 1);

  return null;
}

type CameraTransform = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

type LogoMarker = {
  center: THREE.Vector3;
  footprint: THREE.Vector2;
  key: string;
  position: THREE.Vector3;
  size: number;
  depth: number;
};

type CircuitShader = {
  uniforms: {
    uTime: { value: number };
    uWaveScale: { value: number };
    uWaveSpeed: { value: number };
    uWaveLength: { value: number };
  };
};

function HardwareStage({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { scene } = useGLTF(circuitModelPath);
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
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const planeMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const chipMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const planeShaderRef = useRef<CircuitShader | null>(null);
  const logoGroupRef = useRef<THREE.Group | null>(null);

  useLayoutEffect(() => {
    [squaresMap, normalMap, aoMap, roughnessMap].forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 16;
    });
    squaresMap.colorSpace = THREE.SRGBColorSpace;
    squaresMap.repeat.set(1.4, 1.4);
    pcbMap.colorSpace = THREE.SRGBColorSpace;
    pcbMap.flipY = false;
    pcbMap.anisotropy = 16;
    normalMap.repeat.set(50, 50);
    aoMap.repeat.set(50, 50);
    roughnessMap.repeat.set(50, 50);
  }, [aoMap, normalMap, pcbMap, roughnessMap, squaresMap]);

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        color: pulseGreen,
        depthTest: true,
        depthWrite: false,
        map: squaresMap,
        toneMapped: false,
        transparent: true,
        opacity: 0.62,
      }),
    [squaresMap],
  );

  const planeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        bumpMap: pcbMap,
        bumpScale: 20,
        color: "#07180e",
        emissive: pulseGreen,
        emissiveIntensity: 3.05,
        emissiveMap: pcbMap,
        map: pcbMap,
        metalness: 1,
        normalMap,
        roughness: 0.3,
      }),
    [normalMap, pcbMap],
  );

  useLayoutEffect(() => {
    planeMaterial.onBeforeCompile = (shader) => {
      const uniforms = {
        uTime: { value: 0 },
        uWaveScale: { value: 2.6 },
        uWaveSpeed: { value: 0.16 },
        uWaveLength: { value: 0.965 },
      };
      Object.assign(shader.uniforms, uniforms);
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
        uniform float uTime;
        uniform float uWaveScale;
        uniform float uWaveSpeed;
        uniform float uWaveLength;

        float tracePulse(vec2 uv, float offset, float axisBlend) {
          float circuitAxis = mix(uv.x, uv.y, axisBlend);
          float lane = abs(fract((uv.y + offset) * 18.0) - 0.5);
          float laneMask = 1.0 - smoothstep(0.035, 0.12, lane);
          float phase = fract(circuitAxis * uWaveScale - uTime * uWaveSpeed + offset);
          float head = smoothstep(uWaveLength, 0.992, phase);
          float cut = 1.0 - smoothstep(0.992, 1.0, phase);
          return head * cut * laneMask;
        }

        void main() {`,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        `
        #ifdef USE_EMISSIVEMAP
          vec4 emissiveColor = texture2D(emissiveMap, vEmissiveMapUv);
          float emissiveSelection = step(0.6, emissiveColor.r);
          emissiveColor.rgb *= emissiveSelection;

          float wave = 0.0;
          wave += tracePulse(vEmissiveMapUv, 0.08, 0.18);
          wave += tracePulse(vEmissiveMapUv.yx, 0.42, 0.32) * 0.72;

          float travellingGlow = 0.15 + min(wave, 0.34);
          totalEmissiveRadiance *= emissiveColor.rgb * travellingGlow;
        #endif`,
      );
      planeShaderRef.current = { uniforms };
    };
    planeMaterial.needsUpdate = true;
  }, [planeMaterial]);

  const chipMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        aoMap,
        clearcoat: 0.78,
        clearcoatRoughness: 0.46,
        color: "#11140f",
        emissive: deepGreen,
        emissiveIntensity: 0.42,
        envMapIntensity: 1.65,
        metalness: 0.78,
        normalMap,
        reflectivity: 0.7,
        roughness: 0.42,
        roughnessMap,
      }),
    [aoMap, normalMap, roughnessMap],
  );

  const softGlow = useMemo(() => new THREE.Color(pulseGreen), []);
  const deepGlow = useMemo(() => new THREE.Color(accent), []);
  const logoTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "900 312px Arial, sans-serif";
      context.shadowColor = "#38ff8c";
      context.shadowBlur = 54;
      context.fillStyle = "rgba(56, 255, 140, 0.58)";
      context.fillText("P!", canvas.width / 2, canvas.height / 2 + 6);
      context.shadowBlur = 22;
      context.strokeStyle = "rgba(56, 255, 140, 0.74)";
      context.lineWidth = 10;
      context.strokeText("P!", canvas.width / 2, canvas.height / 2 + 6);
      context.shadowBlur = 10;
      context.fillStyle = "#f5fff8";
      context.fillText("P!", canvas.width / 2, canvas.height / 2 + 6);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
    return texture;
  }, []);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const lowerName = child.name.toLowerCase();
      if (
        lowerName.includes("raven") ||
        lowerName.includes("logo") ||
        lowerName.includes("brand") ||
        lowerName.includes("mark")
      ) {
        child.visible = false;
        return;
      }
      child.frustumCulled = false;
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.name.startsWith("Camera")) {
        child.visible = false;
      } else if (child.name.includes("GlowBox")) {
        child.visible = true;
        child.renderOrder = 1;
        child.material = glowMaterial;
      } else if (child.name === "Plane") {
        child.renderOrder = 0;
        child.material = planeMaterial;
      } else {
        child.renderOrder = 2;
        child.material = chipMaterial;
      }
    });
    return clone;
  }, [chipMaterial, glowMaterial, planeMaterial, scene]);

  useLayoutEffect(() => {
    glowMaterialRef.current = glowMaterial;
    planeMaterialRef.current = planeMaterial;
    chipMaterialRef.current = chipMaterial;
  }, [chipMaterial, glowMaterial, planeMaterial]);

  const logoMarkers = useMemo<LogoMarker[]>(() => {
    model.updateMatrixWorld(true);
    const seen = new Set<string>();
    const markers: LogoMarker[] = [];
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (!child.name.includes("Cube") || child.name === "Plane") return;
      const position = child.getWorldPosition(new THREE.Vector3());
      const key = `${position.x.toFixed(1)}:${position.z.toFixed(1)}`;
      if (seen.has(key)) return;
      seen.add(key);
      const box = new THREE.Box3().setFromObject(child);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      markers.push({
        center,
        footprint: new THREE.Vector2(Math.max(0.26, size.x * 0.94), Math.max(0.26, size.z * 0.94)),
        key: child.name,
        position: position.add(new THREE.Vector3(0, Math.max(0.08, size.y * 0.52 + 0.025), 0)),
        size: Math.max(0.14, Math.min(0.32, Math.max(size.x, size.z) * 0.25)),
        depth: Math.max(0.48, Math.min(1.32, Math.max(size.x, size.z) * 0.58)),
      });
    });
    return markers;
  }, [model]);

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
    const sortedTransforms = transforms
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      .map(({ position, quaternion }) => ({ position, quaternion }));
    if (!sortedTransforms.length) return [];
    return sectionIds.map(
      (_, index) => sortedTransforms[Math.min(index, sortedTransforms.length - 1)],
    );
  }, [model]);

  useFrame(() => {
    if (!cameraTransforms.length) return;
    smoothProgress.current = progressRef.current;
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
    const time = performance.now() * 0.001;
    const pulse = 0.64 + Math.sin(time * 1.22) * 0.28;
    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = 0.54 + pulse * 0.28;
      glowMaterialRef.current.color.copy(deepGlow).lerp(softGlow, 0.58 + pulse * 0.34);
    }
    if (planeMaterialRef.current) {
      planeMaterialRef.current.emissiveIntensity = 3.05;
      planeMaterialRef.current.emissive.copy(softGlow);
      if (planeMaterialRef.current.map) {
        planeMaterialRef.current.map.offset.set(
          Math.sin(time * 0.05) * 0.003,
          Math.cos(time * 0.045) * 0.003,
        );
      }
    }
    if (planeShaderRef.current) {
      planeShaderRef.current.uniforms.uTime.value = time;
    }
    if (chipMaterialRef.current) {
      chipMaterialRef.current.emissiveIntensity = 0.46 + pulse * 0.22;
    }
    if (logoGroupRef.current) {
      logoGroupRef.current.children.forEach((child, index) => {
        const logoPulse = 0.94 + Math.sin(time * 1.3 + index * 0.42) * 0.035;
        child.scale.setScalar(logoPulse);
      });
    }
  });

  return (
    <>
      <primitive object={model} />
      <group ref={logoGroupRef}>
        {logoMarkers.map((marker) => (
          <group key={marker.key} position={marker.position} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[0, 0, -0.012]}>
              <planeGeometry args={[marker.depth * 1.2, marker.depth * 0.74]} />
              <meshBasicMaterial
                color="#020604"
                opacity={0.98}
                polygonOffset
                polygonOffsetFactor={-2}
                transparent
              />
            </mesh>
            <mesh position={[0, 0, -0.024]} renderOrder={8}>
              <planeGeometry args={[marker.depth * 1.04, marker.depth * 0.5]} />
              <meshBasicMaterial
                blending={THREE.AdditiveBlending}
                color={pulseGreen}
                depthTest={false}
                map={logoTexture}
                opacity={0.34}
                toneMapped={false}
                transparent
              />
            </mesh>
            <mesh position={[0, 0, -0.032]} renderOrder={9}>
              <planeGeometry args={[marker.depth * 0.98, marker.depth * 0.48]} />
              <meshBasicMaterial
                depthTest={false}
                map={logoTexture}
                toneMapped={false}
                transparent
              />
            </mesh>
          </group>
        ))}
      </group>
    </>
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
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black text-white"
      data-boot="true"
    >
      <div className="w-[248px]">
        <div className="mb-4 h-[28px] border border-white/25 p-1">
          <div
            className="flex h-full items-center bg-white px-2 text-[20px] leading-none text-black"
            style={{ width: `${percent}%` }}
          >
            {percent}%
          </div>
        </div>
        <div className="flex justify-center gap-1 text-[24px] uppercase leading-none tracking-[0.02em]">
          <span>Loading Protocols</span>
          <span style={{ color: accent }}>.....</span>
        </div>
        <div className="mt-8 text-center text-[24px] uppercase leading-none">Loading Ping</div>
      </div>
      <div className="absolute bottom-7 left-8 text-[12px] uppercase tracking-[0.08em] text-white/70">
        Cc 2026, ping
      </div>
      <div className="absolute bottom-7 right-8 text-[12px] uppercase tracking-[0.08em] text-white/70">
        designed + developed by Ping Ring Inc.
      </div>
    </div>
  );
}

function IntroVideo({
  visible,
  exiting,
  onComplete,
}: {
  visible: boolean;
  exiting: boolean;
  onComplete: () => void;
}) {
  const [muted, setMuted] = useState(true);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] bg-black transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        exiting ? "-translate-y-full" : "translate-y-0"
      }`}
      aria-label="Ping intro video"
    >
      <video
        className="h-full w-full object-cover"
        src={introVideoPath}
        autoPlay
        muted={muted}
        playsInline
        preload="auto"
        onEnded={onComplete}
        onError={onComplete}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/10" />
      <button
        className="absolute right-8 top-8 border border-white/35 bg-black/35 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm transition hover:border-white hover:text-white"
        type="button"
        onClick={() => setMuted((value) => !value)}
      >
        {muted ? "Unmute" : "Mute"}
      </button>
      <button
        className="absolute bottom-8 right-8 border border-white/35 bg-black/35 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm transition hover:border-white hover:text-white"
        type="button"
        onClick={onComplete}
      >
        Skip intro
      </button>
    </div>
  );
}

function Header() {
  return (
    <header className="group fixed left-0 top-0 z-40 flex h-[88px] w-full items-center border-b border-white/10 bg-[#050505]/92 pl-[5vw] pr-[3vw] backdrop-blur-sm">
      <a
        className="mr-auto flex items-center gap-3 text-[22px] font-bold uppercase tracking-[0.02em]"
        href="#top"
      >
        <span className="grid h-9 w-9 place-items-center border border-white/25 bg-white text-[16px] font-black leading-none text-black shadow-[0_0_24px_rgba(56,255,140,0.18)]">
          P!
        </span>
        Ping
      </a>
      <nav className="hidden items-center gap-9 text-[12px] uppercase tracking-[0.16em] md:flex">
        <a href="#top">Home</a>
        <a href="#about">
          What we do <span style={{ color: accent }}>▾</span>
        </a>
        <a href="#markets">Markets</a>
        <a href="#platform">About</a>
        <a href="#why">Careers</a>
      </nav>
      <a
        className="ml-auto hidden border border-white/20 px-8 py-4 text-[12px] uppercase tracking-[0.25em] md:block"
        href="https://getping.today"
      >
        Let&apos;s connect →
      </a>
      <a className="ml-auto text-[12px] uppercase tracking-[0.2em] md:hidden" href="#about">
        menu
      </a>
      <div className="pointer-events-none absolute left-0 top-[88px] hidden w-full border-b border-white/10 bg-[#050505]/96 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 md:block">
        <div className="mx-auto grid w-[76vw] max-w-[1110px] grid-cols-3 gap-10 py-10">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em] text-white">
                {group.title}
              </p>
              <div className="grid gap-4">
                {group.items.map(([title, body]) => (
                  <a
                    className="grid grid-cols-[16px_1fr] gap-3 text-left"
                    href="#markets"
                    key={title}
                  >
                    <span className="mt-1 h-2.5 w-2.5 border border-white/70" />
                    <span>
                      <span className="block text-[13px] font-bold uppercase tracking-[0.08em] text-white">
                        {title}
                      </span>
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
  const labels = ["start", "about", "network", "built for", "ecosystem", "why"];

  return (
    <aside
      className="fixed right-[3vw] top-1/2 z-40 hidden -translate-y-1/2 md:block"
      data-nav-rail
    >
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
              active === index
                ? "rounded-full border-white text-white"
                : "border-white/35 text-white"
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

function HeroSection({ active }: { active: boolean }) {
  return (
    <header className="section relative min-h-screen pt-[88px]" id="top">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-[76vw] max-w-[1320px] flex-col justify-between py-[48px] md:pr-[108px]">
        <div className="grid grid-cols-[42px_1fr] gap-5 pt-3 text-[11px] uppercase tracking-[0.18em] text-white/55 md:grid-cols-[54px_1fr]">
          <span>#</span>
          <span>01 / NFC identity system</span>
        </div>
        <h1
          className={`display-type ml-[4vw] max-w-[92vw] text-[40px] uppercase leading-[0.86] text-white transition-all duration-700 ease-out md:ml-[8vw] md:text-[52px] xl:ml-[19vw] xl:max-w-none xl:text-[70px] ${active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-50"}`}
        >
          <span className="block xl:whitespace-nowrap">
            PING<span style={{ color: accent }}>*</span>
          </span>
        </h1>
        <div
          className={`ml-auto w-full max-w-[490px] pb-1 transition-all delay-100 duration-700 ease-out ${active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-45"}`}
        >
          <h2 className="mono-title text-[24px] uppercase leading-none">we are ping</h2>
          <p className="mt-5 text-[16px] leading-6 text-white">
            Ping! is a professional network app and NFC ring that turns the people you meet into a
            visual, organized network you can actually use.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-5">
            <a className="button-ping is-solid" href="https://getping.today">
              Get Ping!
            </a>
            <a className="button-ping is-solid" href="#platform">
              Careers
            </a>
          </div>
          <a
            className="mt-8 block text-[12px] uppercase tracking-[0.12em] text-white/50"
            href="#about"
          >
            Scroll to learn more...
          </a>
        </div>
      </div>
    </header>
  );
}

function AboutSection({ active }: { active: boolean }) {
  return (
    <section className="section min-h-screen" id="about">
      <div className="mx-auto flex min-h-screen w-[76vw] max-w-[1320px] items-center md:pr-[108px]">
        <div
          className={`w-full max-w-[442px] transition-all duration-700 ease-out ${active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-45"}`}
        >
          <h2 className="mono-title text-[24px] uppercase leading-none">About us</h2>
          <p className="mt-5 text-[16px] leading-6 text-white">
            Ping! was founded on a simple belief: your network is your net worth, and you should be
            able to see it.
          </p>
          <p className="mt-5 text-[16px] leading-6 text-white">
            The ring is the first step toward a full ecosystem of human connection: a tap-to-profile
            experience, contact memory, circles, and a network visualizer.
          </p>
          <div className="mt-16 text-[12px] uppercase tracking-[0.2em] text-white/55">
            Invested by
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-14 text-[15px] font-bold uppercase tracking-[0.08em] text-white/80">
            {proofLogos.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketsSection({ active }: { active: boolean }) {
  return (
    <section className="section min-h-screen pt-[88px]" id="markets">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-[76vw] max-w-[1320px] flex-col justify-end pb-[8vh] pt-[16vh] md:pr-[108px]">
        <div
          className={`mb-auto ml-auto max-w-[560px] pt-[11vh] text-right transition-all duration-700 ease-out ${active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-45"}`}
        >
          <h2 className="mono-title text-[24px] uppercase leading-none">Markets we operate in</h2>
          <p className="ml-auto mt-5 max-w-[500px] text-[16px] leading-6 text-white">
            Your network, visualized, organized, and in your control.
          </p>
        </div>
        <div
          className={`grid border-y border-white/14 bg-black/20 backdrop-blur-[1px] transition-all delay-100 duration-700 ease-out md:grid-cols-3 ${active ? "translate-y-0 opacity-100" : "translate-y-10 opacity-45"}`}
        >
          {marketCards.map(([number, title, body]) => (
            <article
              className="min-h-[260px] border-b border-white/14 p-6 md:border-b-0 md:border-r md:p-7 last:md:border-r-0"
              key={title}
            >
              <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: accent }}>
                {number}
              </p>
              <h3 className="display-type mt-6 text-[32px] uppercase leading-[0.95] text-white md:text-[34px] xl:text-[40px]">
                {title.split(" ").map((word) => (
                  <span className="block" key={word}>
                    {word}
                  </span>
                ))}
              </h3>
              <p className="mt-6 max-w-[250px] text-[15px] leading-6 text-white">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformSection({ active }: { active: boolean }) {
  return (
    <section className="section min-h-screen pt-[88px]" id="platform">
      <div className="mx-auto grid min-h-[calc(100vh-88px)] w-[76vw] max-w-[1320px] grid-rows-[0.46fr_0.54fr] pb-[6vh] pt-[6vh] md:pr-[108px]">
        <div
          className={`self-center transition-all duration-700 ease-out ${
            active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-45"
          }`}
        >
          <div className="max-w-[470px]">
            <h2 className="mono-title text-[24px] uppercase leading-none">Built for</h2>
            <p className="mt-5 text-[16px] leading-6 text-white">
              Ping works for individual operators, event-heavy communities, and teams that need
              every warm relationship to stay visible.
            </p>
          </div>
          <div className="mt-14 grid max-w-[520px] grid-cols-2 gap-12 text-[12px] uppercase tracking-[0.18em] text-white/45">
            <span>
              Launch batch
              <br />
              <b className="mt-4 block text-[18px] tracking-[0.04em] text-white">
                First 1,000 rings
              </b>
            </span>
            <span>
              Public price
              <br />
              <b className="mt-4 block text-[18px] tracking-[0.04em] text-white">$49.99</b>
            </span>
          </div>
        </div>
        <div
          className={`self-end transition-all delay-100 duration-700 ease-out ${
            active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-50"
          }`}
        >
          <div className="grid grid-cols-3 items-center gap-x-7 gap-y-11 text-white md:grid-cols-6">
            {exchangeLogos.map((item, index) => (
              <div
                className={`whitespace-nowrap text-center font-black tracking-tight ${index % 5 === 0 ? "text-[26px]" : "text-[19px]"}`}
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustrySection({ active }: { active: boolean }) {
  return (
    <section className="section relative min-h-screen pt-[88px]" id="industry">
      <div className="mx-auto grid min-h-[calc(100vh-88px)] w-[76vw] max-w-[1320px] grid-rows-[0.48fr_0.52fr] pb-[7vh] pt-[7vh] md:pr-[118px]">
        <div
          className={`max-w-[520px] self-start transition-all duration-700 ease-out ${active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-45"}`}
        >
          <h2 className="display-type text-[34px] uppercase leading-none text-white md:text-[42px]">
            Powering human connection
          </h2>
          <p className="mt-7 max-w-[390px] text-[15px] leading-7 text-white">
            Transform your network into a living universe. Visualize circles, track relationship
            health, and get reminders when it is time to reconnect.
          </p>
        </div>
        <div
          className={`pointer-events-none relative self-end transition-all delay-100 duration-700 ease-out ${active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-35"}`}
        >
          <div className="ml-auto grid max-w-[690px] grid-cols-4 gap-3">
            {industryPills.map((item, index) => (
              <div
                className="min-w-0 border border-white/22 bg-black/38 px-4 py-2.5 text-center text-[15px] font-black lowercase tracking-[0.02em] text-white backdrop-blur-[2px]"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection({ active }: { active: boolean }) {
  return (
    <section className="section min-h-screen pt-[88px]" id="why">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-[98vw] flex-col justify-start pt-[2vh]">
        <div
          className={`rounded-[4px] px-[4vw] py-[11vh] text-white transition-all duration-700 ease-out ${active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-55"}`}
          style={{ background: accent }}
        >
          <div className="mb-[17vh] flex items-start justify-between">
            <h2 className="display-type text-[72px] uppercase leading-none text-white/35 md:text-[104px]">
              Why us?
            </h2>
            <div className="grid h-16 w-16 place-items-center border border-white/25 text-2xl text-white/45">
              ◊
            </div>
          </div>
          <div className="mx-auto grid max-w-[1320px] gap-16 md:grid-cols-3">
            {whyCards.map(([title, body]) => (
              <article className="p-2" key={title}>
                <h3 className="mono-title text-[28px] uppercase leading-none text-white">
                  {title}
                </h3>
                <p className="mt-8 text-[16px] leading-7 text-white">{body}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-20 grid items-center gap-10 border-t border-white/12 pt-12 md:grid-cols-[0.44fr_0.56fr]">
          <div className="aspect-[4/3] border border-white/12 bg-[linear-gradient(135deg,rgba(15,111,61,0.48),rgba(255,255,255,0.06)_38%,rgba(0,0,0,0.2))]" />
          <div>
            <p className="mono-title text-[24px] uppercase leading-none">Early access</p>
            <h2 className="mono-title mt-10 text-[24px] uppercase leading-none">working at ping</h2>
            <p className="mt-6 text-[28px] font-bold uppercase leading-[1.05] md:text-[42px]">
              Launching our first 1,000 rings soon.
            </p>
            <p className="mt-6 text-[16px] leading-6 text-white/72">
              Join us as we redefine connection across the app, NFC ring, profile layer, and team
              workspace ecosystem.
            </p>
            <a className="button-ping mt-8 max-w-[260px]" href="https://getping.today">
              Join early access
            </a>
            <blockquote className="mt-12 border-l border-white/20 pl-6 text-[16px] leading-6 text-white/72">
              “Because connecting with the right person changes everything.”
              <br />
              <span className="mt-3 block text-[12px] uppercase tracking-[0.16em] text-white/45">
                Ping team, 2026
              </span>
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
          Our mission is to enhance human connection. Ping! helps people visualize their network,
          organize contacts into circles, and turn real-world meetings into lasting relationship
          context.
        </p>
        <div className="text-[12px] uppercase tracking-[0.16em] text-white/60">
          Network visualizer
          <br />
          Ping ring
          <br />
          Team workspaces
        </div>
        <div className="text-[12px] uppercase tracking-[0.16em] text-white/60">
          {integrationPills.join(" / ")}
          <br />
          <br />
          designed + developed by Ping Ring Inc.
        </div>
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
  const [introDone, setIntroDone] = useState(false);
  const [introExiting, setIntroExiting] = useState(false);
  const scrollLock = useRef(false);
  const scrollAnimation = useRef<number | null>(null);
  const scrollSettleTimer = useRef<number | null>(null);
  const wheelGateTimer = useRef<number | null>(null);
  const introExitTimer = useRef<number | null>(null);
  const settledSection = useRef(0);
  const targetSection = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setBootDone(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = ready && bootDone && introDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [bootDone, introDone, progressRef, ready]);

  useEffect(() => {
    if (!introDone) {
      window.scrollTo(0, 0);
      progressRef.current = 0;
      settledSection.current = 0;
      targetSection.current = 0;
    }
  }, [introDone, progressRef]);

  useEffect(() => {
    if (!ready || !bootDone || !introDone) return;
    const animateToSection = (index: number) => {
      if (scrollAnimation.current) window.cancelAnimationFrame(scrollAnimation.current);
      const nextIndex = clamp(index, 0, sectionIds.length - 1);
      targetSection.current = nextIndex;
      const target = Math.round(nextIndex * window.innerHeight);
      const start = window.scrollY;
      const distance = target - start;
      const maxScroll = Math.max(1, window.innerHeight * (sectionIds.length - 1));
      const duration = 1500;
      const startedAt = performance.now();
      scrollLock.current = true;
      progressRef.current = clamp(start / maxScroll);

      const step = (now: number) => {
        const elapsed = clamp((now - startedAt) / duration);
        const eased = easeInOutCubic(elapsed);
        const nextTop = Math.round(start + distance * eased);
        progressRef.current = clamp(nextTop / maxScroll);
        window.scrollTo(0, nextTop);
        if (elapsed < 1) {
          scrollAnimation.current = window.requestAnimationFrame(step);
          return;
        }
        window.scrollTo(0, target);
        progressRef.current = clamp(target / maxScroll);
        settledSection.current = nextIndex;
        window.setTimeout(() => {
          scrollLock.current = false;
          scrollAnimation.current = null;
        }, 160);
      };

      scrollAnimation.current = window.requestAnimationFrame(step);
    };

    const handleWheel = (event: WheelEvent) => {
      if (window.innerWidth < 768 || Math.abs(event.deltaY) < 18) return;
      event.preventDefault();
      if (scrollLock.current || wheelGateTimer.current) return;
      if (scrollSettleTimer.current) window.clearTimeout(scrollSettleTimer.current);
      const current = settledSection.current;
      const next = clamp(current + (event.deltaY > 0 ? 1 : -1), 0, sectionIds.length - 1);
      wheelGateTimer.current = window.setTimeout(() => {
        wheelGateTimer.current = null;
      }, 1800);
      animateToSection(next);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !["ArrowDown", "PageDown", "ArrowUp", "PageUp", "Home", "End"].includes(event.key) ||
        window.innerWidth < 768
      )
        return;
      event.preventDefault();
      if (scrollLock.current) return;
      if (scrollSettleTimer.current) window.clearTimeout(scrollSettleTimer.current);
      const current = settledSection.current;
      if (event.key === "Home") animateToSection(0);
      else if (event.key === "End") animateToSection(sectionIds.length - 1);
      else
        animateToSection(
          current + (event.key === "ArrowDown" || event.key === "PageDown" ? 1 : -1),
        );
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!link || window.innerWidth < 768) return;
      const id = link.hash.slice(1);
      const index = sectionIds.indexOf(id);
      if (index < 0) return;
      event.preventDefault();
      if (scrollSettleTimer.current) window.clearTimeout(scrollSettleTimer.current);
      animateToSection(index);
    };

    const handleScroll = () => {
      if (window.innerWidth < 768 || scrollLock.current) return;
      if (scrollSettleTimer.current) window.clearTimeout(scrollSettleTimer.current);
      scrollSettleTimer.current = window.setTimeout(() => {
        const rawNearest = clamp(
          Math.round(window.scrollY / window.innerHeight),
          0,
          sectionIds.length - 1,
        );
        const current = settledSection.current;
        const nearest =
          Math.abs(rawNearest - current) > 1
            ? clamp(current + Math.sign(rawNearest - current), 0, sectionIds.length - 1)
            : rawNearest;
        animateToSection(nearest);
      }, 260);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleAnchorClick);
    return () => {
      if (scrollAnimation.current) window.cancelAnimationFrame(scrollAnimation.current);
      if (scrollSettleTimer.current) window.clearTimeout(scrollSettleTimer.current);
      if (wheelGateTimer.current) window.clearTimeout(wheelGateTimer.current);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [bootDone, introDone, progressRef, ready]);

  useEffect(() => {
    return () => {
      if (introExitTimer.current) window.clearTimeout(introExitTimer.current);
    };
  }, []);

  const finishIntro = () => {
    if (introDone || introExiting) return;
    setIntroExiting(true);
    introExitTimer.current = window.setTimeout(() => {
      window.scrollTo(0, 0);
      progressRef.current = 0;
      setIntroDone(true);
      setIntroExiting(false);
    }, 1180);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <CircuitScene onReady={() => setReady(true)} progressRef={progressRef} />
      <IntroVideo visible={!introDone} exiting={introExiting} onComplete={finishIntro} />
      <Loader visible={introDone && (!ready || !bootDone)} />
      <Header />
      <ProgressRail active={active} />

      <div className="relative z-10">
        <HeroSection active={active === 0} />
        <AboutSection active={active === 1} />
        <MarketsSection active={active === 2} />
        <PlatformSection active={active === 3} />
        <IndustrySection active={active === 4} />
        <WhySection active={active === 5} />
        <Footer />
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: auto; background: #000000; }
        html, body { max-width: 100%; overflow-x: hidden; overscroll-behavior-y: contain; }
        body { background: #000000; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .section { overflow: hidden; }
        .ethereal-glow {
          mix-blend-mode: screen;
          opacity: 0.42;
          animation: etherealBreath 5.8s ease-in-out infinite;
          background:
            radial-gradient(circle at 29% 58%, rgba(56,255,140,0.1), rgba(56,255,140,0.02) 27%, transparent 52%),
            radial-gradient(circle at 71% 34%, rgba(185,255,216,0.06), rgba(56,255,140,0.018) 24%, transparent 50%),
            linear-gradient(115deg, transparent 0%, rgba(56,255,140,0.028) 44%, transparent 72%);
          filter: blur(18px) saturate(1.25);
        }
        .ethereal-vignette {
          background:
            radial-gradient(circle at 50% 45%, transparent 0%, transparent 46%, rgba(0,0,0,0.72) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.8), transparent 22%, transparent 76%, rgba(0,0,0,0.74));
        }
        @keyframes etherealBreath {
          0%, 100% {
            opacity: 0.28;
            transform: scale(1);
          }
          50% {
            opacity: 0.58;
            transform: scale(1.035);
          }
        }
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
        .button-ping {
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
        .button-ping:hover { border-color: ${accent}; color: ${accent}; }
        .button-ping.is-solid {
          border-color: ${accent};
          background: ${accent};
          color: #000000;
          font-weight: 800;
        }
        .button-ping.is-solid:hover {
          background: #ffffff;
          border-color: #ffffff;
          color: #000000;
        }
      `}</style>
    </main>
  );
}
