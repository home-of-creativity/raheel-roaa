"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { publicAsset } from "@/src/lib/publicPath";

export type CinematicRefs = {
  camera: THREE.PerspectiveCamera;
  look: THREE.Vector3;
  plane: THREE.Group;
  cloudsLeft: THREE.Group;
  cloudsRight: THREE.Group;
  sky: THREE.Color;
  fog: THREE.Fog;
};

type CinematicSceneProps = {
  onReady: (refs: CinematicRefs) => void;
  reducedFx: boolean;
};

const AIRPLANE_URL = publicAsset("/rahil_roaa_greybox.glb");
const LOOK = new THREE.Vector3(0, 0.4, 0);
const SKY = new THREE.Color("#9ec8e8");
const CLOUD_TEXT = "Raheel & Roaa";

function polishAircraft(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const name = obj.name.toLowerCase();
    const isGlass = name.includes("glass") || name.includes("cockpit");
    obj.material = new THREE.MeshStandardMaterial({
      color: isGlass ? 0x1c242c : 0xf6f3ec,
      metalness: isGlass ? 0.85 : 0.62,
      roughness: isGlass ? 0.12 : 0.28,
      envMapIntensity: 1.2,
    });
  });
}

function fit(object: THREE.Object3D, size: number) {
  const box = new THREE.Box3().setFromObject(object);
  const dim = box.getSize(new THREE.Vector3());
  const max = Math.max(dim.x, dim.y, dim.z) || 1;
  object.scale.multiplyScalar(size / max);
  box.setFromObject(object);
  object.position.sub(box.getCenter(new THREE.Vector3()));
}

function Aircraft({ scale = 6.2 }: { scale?: number }) {
  const gltf = useGLTF(AIRPLANE_URL);
  const scene = useMemo(() => {
    const cloned = clone(gltf.scene);
    fit(cloned, scale);
    cloned.rotation.y = -Math.PI / 2;
    polishAircraft(cloned);
    return cloned;
  }, [gltf.scene, scale]);
  return <primitive object={scene} />;
}

function makeCloudSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();
  const glow = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  glow.addColorStop(0, "rgba(255,255,255,0.95)");
  glow.addColorStop(0.35, "rgba(248,250,255,0.55)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function sampleTextClouds(text: string, step: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 280;
  const ctx = canvas.getContext("2d");
  const left: THREE.Vector3[] = [];
  const right: THREE.Vector3[] = [];
  if (!ctx) return { left, right };

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "600 150px 'Cormorant Garamond', 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 8);

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] < 90) continue;
      const px = (x / width - 0.5) * 16;
      const py = (0.5 - y / height) * 3.4;
      const pz = (Math.random() - 0.5) * 1.1;
      const point = new THREE.Vector3(px, py, pz);
      if (px < 0) left.push(point);
      else right.push(point);
    }
  }
  return { left, right };
}

function CloudLetterField({
  points,
  sprite,
}: {
  points: THREE.Vector3[];
  sprite: THREE.Texture;
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const sizes = new Float32Array(points.length);
    for (let i = 0; i < points.length; i += 1) {
      sizes[i] = 0.55 + Math.random() * 0.7;
    }
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [points]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: sprite,
        color: 0xffffff,
        size: 0.72,
        transparent: true,
        depthWrite: false,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [sprite],
  );

  return <points geometry={geometry} material={material} />;
}

function SceneRig({ onReady, reducedFx }: CinematicSceneProps) {
  const { camera, scene } = useThree();
  const plane = useRef<THREE.Group>(null);
  const cloudsLeft = useRef<THREE.Group>(null);
  const cloudsRight = useRef<THREE.Group>(null);
  const look = useRef(LOOK.clone());
  const sky = useRef(SKY.clone());
  const fog = useRef(new THREE.Fog(SKY.clone(), 14, reducedFx ? 70 : 90));
  const ready = useRef(false);

  const sprite = useMemo(() => makeCloudSprite(), []);
  const letters = useMemo(
    () => sampleTextClouds(CLOUD_TEXT, reducedFx ? 7 : 4),
    [reducedFx],
  );

  useFrame(() => {
    camera.lookAt(look.current);
    scene.background = sky.current;
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(sky.current);
    }

    if (ready.current) return;
    if (!plane.current || !cloudsLeft.current || !cloudsRight.current) return;

    ready.current = true;
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 40;
    cam.near = 0.1;
    cam.far = 240;
    cam.position.set(-2.4, 1.6, 8.5);
    cam.updateProjectionMatrix();
    scene.fog = fog.current;
    onReady({
      camera: cam,
      look: look.current,
      plane: plane.current,
      cloudsLeft: cloudsLeft.current,
      cloudsRight: cloudsRight.current,
      sky: sky.current,
      fog: fog.current,
    });
  });

  return (
    <>
      <color attach="background" args={[SKY.getHex()]} />
      <fog attach="fog" args={[SKY.getHex(), 14, reducedFx ? 70 : 90]} />
      <hemisphereLight args={["#fff1dc", "#4a6278", 0.9]} />
      <directionalLight position={[14, 12, 8]} intensity={1.7} color="#ffe0b0" />
      <directionalLight position={[-10, 4, -6]} intensity={0.28} color="#7f98b0" />
      <ambientLight intensity={0.32} />

      <group ref={plane} position={[-16, 0.4, 0]}>
        <Aircraft />
      </group>

      <group ref={cloudsLeft} position={[0, 1.1, -3]} scale={0.01} visible>
        <CloudLetterField points={letters.left} sprite={sprite} />
      </group>
      <group ref={cloudsRight} position={[0, 1.1, -3]} scale={0.01} visible>
        <CloudLetterField points={letters.right} sprite={sprite} />
      </group>
    </>
  );
}

export function CinematicScene({ onReady, reducedFx }: CinematicSceneProps) {
  return (
    <Canvas
      gl={{ antialias: !reducedFx, powerPreference: "high-performance", alpha: false }}
      dpr={reducedFx ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: 40, near: 0.1, far: 240, position: [-2.4, 1.6, 8.5] }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneRig onReady={onReady} reducedFx={reducedFx} />
    </Canvas>
  );
}

useGLTF.preload(AIRPLANE_URL);
