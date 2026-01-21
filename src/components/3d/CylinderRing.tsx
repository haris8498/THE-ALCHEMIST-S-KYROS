import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CylinderRingProps {
  position: [number, number, number];
  isActive: boolean;
  isTyping: boolean;
  ringIndex: number;
  glowIntensity: number;
  isOpen?: boolean;
}

export const CylinderRing = ({ 
  position, 
  isActive, 
  isTyping, 
  ringIndex, 
  glowIntensity,
  isOpen = false 
}: CylinderRingProps) => {
  const ringRef = useRef<THREE.Group>(null);
  const runeRef = useRef<THREE.Mesh>(null);
  
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  // Create rune pattern geometry
  const runeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const runeCount = 12;
    const angleStep = (Math.PI * 2) / runeCount;
    
    for (let i = 0; i < runeCount; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * 0.85;
      const y = Math.sin(angle) * 0.85;
      
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();
    
    return new THREE.ShapeGeometry(shape);
  }, []);

  useFrame((state, delta) => {
    if (ringRef.current) {
      // Smooth rotation when typing
      if (isTyping && isActive) {
        targetRotation.current += delta * 2;
      }
      
      // Lerp to target
      currentRotation.current = THREE.MathUtils.lerp(
        currentRotation.current,
        targetRotation.current,
        0.1
      );
      
      ringRef.current.rotation.y = currentRotation.current;
      
      // Subtle idle animation
      if (!isActive) {
        ringRef.current.rotation.y += Math.sin(state.clock.elapsedTime + ringIndex) * 0.001;
      }
      
      // Open animation for password reveal
      if (isOpen && ringIndex === 1) {
        ringRef.current.position.y = THREE.MathUtils.lerp(
          ringRef.current.position.y,
          position[1] + 0.3,
          0.05
        );
      } else {
        ringRef.current.position.y = THREE.MathUtils.lerp(
          ringRef.current.position.y,
          position[1],
          0.05
        );
      }
    }
  });

  const emissiveColor = ringIndex === 0 ? '#00ffff' : '#ff00ff';
  const baseColor = ringIndex === 0 ? '#0a4a5a' : '#4a0a5a';

  return (
    <group ref={ringRef} position={position}>
      {/* Main ring */}
      <mesh>
        <torusGeometry args={[0.8, 0.15, 16, 64]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={isActive ? 0.5 + glowIntensity * 0.5 : 0.1}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* Inner detail ring */}
      <mesh>
        <torusGeometry args={[0.6, 0.05, 8, 32]} />
        <meshStandardMaterial
          color="#111"
          emissive={emissiveColor}
          emissiveIntensity={isActive ? 0.3 + glowIntensity * 0.3 : 0.05}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Rune segments around the ring */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.8,
            0,
            Math.sin((i / 8) * Math.PI * 2) * 0.8
          ]}
          rotation={[Math.PI / 2, 0, (i / 8) * Math.PI * 2]}
        >
          <boxGeometry args={[0.08, 0.02, 0.2]} />
          <meshStandardMaterial
            color="#000"
            emissive={emissiveColor}
            emissiveIntensity={isActive ? 0.8 + Math.sin(i + glowIntensity * 10) * 0.4 : 0.1}
            metalness={1}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};
