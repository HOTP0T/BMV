import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SceneContents: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0;
    const y = 0;
    shape.moveTo(x, y);
    shape.bezierCurveTo(x - 0.3, y - 0.35, x - 0.8, y + 0.1, x, y + 0.7);
    shape.bezierCurveTo(x + 0.8, y + 0.1, x + 0.3, y - 0.35, x, y);
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.16,
      bevelSegments: 4,
      bevelOffset: 0,
      curveSegments: 32,
      steps: 2,
    }),
    []
  );

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime() * 0.25;
    const group = groupRef.current;
    if (!group) return;

    // idle rotation
    group.rotation.y = Math.sin(t) * 0.55;
    group.rotation.x = Math.cos(t * 0.7) * 0.18;

    // stronger parallax from pointer so it moves out from behind the card
    const baseX = 3.3;
    const baseY = 1.8;
    const targetX = baseX + pointer.x * 1.4;
    const targetY = baseY + pointer.y * 1.0;
    group.position.x += (targetX - group.position.x) * 0.12;
    group.position.y += (targetY - group.position.y) * 0.12;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 4, 6]}
        intensity={1.3}
        color={new THREE.Color("#ffd1e1")}
      />
      <directionalLight
        position={[-4, -2, -4]}
        intensity={0.5}
        color={new THREE.Color("#7c3aed")}
      />
      {/* move heart to top-right so it's clearly visible around the card */}
      <group ref={groupRef} position={[3.3, 1.8, -2.4]}>
        {/* main glossy heart */}
        <mesh scale={[2.7, 2.7, 2.7]} rotation={[0, 0, Math.PI]}>
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color={new THREE.Color("#ff8fb7")}
            metalness={0.3}
            roughness={0.18}
            clearcoat={0.9}
            clearcoatRoughness={0.15}
            reflectivity={0.9}
            emissive={new THREE.Color("#ff4b7a")}
            emissiveIntensity={0.9}
          />
        </mesh>

        {/* soft outer glow */}
        <mesh scale={[2.95, 2.95, 2.95]} rotation={[0, 0, Math.PI]}>
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <meshBasicMaterial
            color={new THREE.Color("#ffb6d9")}
            transparent
            opacity={0.18}
          />
        </mesh>

        {/* small orbiting hearts */}
        {[-0.8, 0.6].map((offset, idx) => (
          <mesh
            key={idx}
            position={[offset, 0.2 + idx * 0.5, -0.6]}
            scale={[0.7, 0.7, 0.7]}
            rotation={[0, 0, Math.PI]}
          >
            <extrudeGeometry args={[heartShape, extrudeSettings]} />
            <meshStandardMaterial
              color={idx === 0 ? new THREE.Color("#ffd1e8") : new THREE.Color("#ffc0cb")}
              metalness={0.1}
              roughness={0.3}
              emissive={new THREE.Color("#ff7aa2")}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>
    </>
  );
};

export const BackgroundScene: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 52 }}
      style={{
        position: "absolute",
        inset: 0,
      }}
    >
      <color attach="background" args={["#050309"]} />
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
};

