import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldDustParticlesProps {
  count?: number;
  mousePosition?: { x: number; y: number };
}

export const GoldDustParticles = ({ count = 800, mousePosition = { x: 0, y: 0 } }: GoldDustParticlesProps) => {
  const mesh = useRef<THREE.Points>(null);
  const originalPositions = useRef<Float32Array>();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute in a sphere around the scene
      const radius = 3 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Gold tones with variation
      const goldVariant = Math.random();
      if (goldVariant < 0.6) {
        // Rich gold
        colors[i3] = 0.95 + Math.random() * 0.05;
        colors[i3 + 1] = 0.75 + Math.random() * 0.15;
        colors[i3 + 2] = 0.2 + Math.random() * 0.2;
      } else if (goldVariant < 0.85) {
        // Pale gold/cream
        colors[i3] = 0.95;
        colors[i3 + 1] = 0.9;
        colors[i3 + 2] = 0.7;
      } else {
        // Teal accent
        colors[i3] = 0.2;
        colors[i3 + 1] = 0.8;
        colors[i3 + 2] = 0.8;
      }
      
      sizes[i] = 0.02 + Math.random() * 0.04;
    }
    
    originalPositions.current = positions.slice();
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (mesh.current && originalPositions.current) {
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ox = originalPositions.current[i3];
        const oy = originalPositions.current[i3 + 1];
        const oz = originalPositions.current[i3 + 2];
        
        // Gentle floating motion
        positions[i3] = ox + Math.sin(time * 0.3 + i * 0.1) * 0.1;
        positions[i3 + 1] = oy + Math.sin(time * 0.2 + i * 0.15) * 0.15;
        positions[i3 + 2] = oz + Math.cos(time * 0.25 + i * 0.1) * 0.1;
        
        // Parallax effect based on mouse
        positions[i3] += mousePosition.x * (oz * 0.02);
        positions[i3 + 1] += mousePosition.y * (oz * 0.02);
      }
      
      mesh.current.geometry.attributes.position.needsUpdate = true;
      mesh.current.rotation.y = time * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
