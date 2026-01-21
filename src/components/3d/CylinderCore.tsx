import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CylinderCoreProps {
  isRevealed: boolean;
  intensity: number;
}

export const CylinderCore = ({ isRevealed, intensity }: CylinderCoreProps) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      coreRef.current.scale.setScalar(isRevealed ? scale : 0.3);
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y = -state.clock.elapsedTime * 0.3;
      const glowScale = isRevealed ? 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2 : 0.5;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group>
      {/* Inner core */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ffff"
          emissiveIntensity={isRevealed ? 2 + intensity : 0.5}
          transparent
          opacity={isRevealed ? 1 : 0.3}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={isRevealed ? 1 : 0.2}
          transparent
          opacity={isRevealed ? 0.4 : 0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Point light from core */}
      <pointLight
        color="#00ffff"
        intensity={isRevealed ? 2 + intensity : 0.5}
        distance={5}
        decay={2}
      />
    </group>
  );
};
