import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CelestialCoreProps {
  isRevealed: boolean;
  intensity: number;
}

export const CelestialCore = ({ isRevealed, intensity }: CelestialCoreProps) => {
  const coreRef = useRef<THREE.Group>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.3;
      coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
    
    if (innerCoreRef.current) {
      const targetScale = isRevealed ? 1 + Math.sin(time * 4) * 0.1 : 0.3;
      innerCoreRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.05
      );
    }
    
    if (outerGlowRef.current) {
      const glowScale = isRevealed ? 2 + Math.sin(time * 2) * 0.3 : 0.5;
      outerGlowRef.current.scale.lerp(
        new THREE.Vector3(glowScale, glowScale, glowScale),
        0.03
      );
    }
    
    if (raysRef.current) {
      raysRef.current.rotation.z = time * 0.5;
      raysRef.current.children.forEach((ray, i) => {
        const mesh = ray as THREE.Mesh;
        const scale = isRevealed ? 1 + Math.sin(time * 3 + i) * 0.2 : 0.1;
        mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, scale, 0.05);
      });
    }
  });

  return (
    <group ref={coreRef}>
      {/* Inner brilliant core */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.25, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#fffef0"
          emissiveIntensity={isRevealed ? 3 + intensity : 0.5}
          transparent
          opacity={isRevealed ? 1 : 0.3}
        />
      </mesh>
      
      {/* Secondary core layer */}
      <mesh scale={0.8}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={isRevealed ? 1.5 : 0.2}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
      
      {/* Outer glow sphere */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#ffecd2"
          emissive="#ffd700"
          emissiveIntensity={isRevealed ? 0.8 : 0.1}
          transparent
          opacity={isRevealed ? 0.3 : 0.05}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Volumetric light rays */}
      <group ref={raysRef}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[0, 0, 0]}
              rotation={[0, 0, angle]}
            >
              <planeGeometry args={[0.02, 2]} />
              <meshBasicMaterial
                color="#fffef0"
                transparent
                opacity={isRevealed ? 0.3 : 0.02}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Core point lights */}
      <pointLight
        color="#ffd700"
        intensity={isRevealed ? 3 + intensity : 0.3}
        distance={8}
        decay={2}
      />
      <pointLight
        color="#ffffff"
        intensity={isRevealed ? 2 : 0.1}
        distance={4}
        decay={2}
      />
    </group>
  );
};
