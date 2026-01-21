import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CelestialRingProps {
  radius: number;
  position: [number, number, number];
  isActive: boolean;
  isTyping: boolean;
  ringIndex: number;
  glowIntensity: number;
  isOpen?: boolean;
  typedChars?: string;
}

// Runic characters for display
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

export const CelestialRing = ({
  radius,
  position,
  isActive,
  isTyping,
  ringIndex,
  glowIntensity,
  isOpen = false,
  typedChars = ''
}: CelestialRingProps) => {
  const ringRef = useRef<THREE.Group>(null);
  const runeGroupRef = useRef<THREE.Group>(null);
  
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const openOffset = useRef(0);

  // Generate rune positions around the ring
  const runePositions = useMemo(() => {
    const positions: { x: number; z: number; angle: number }[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        angle: angle
      });
    }
    return positions;
  }, [radius]);

  useFrame((state, delta) => {
    if (ringRef.current) {
      // Rotation when typing
      if (isTyping && isActive) {
        targetRotation.current += delta * 1.5;
      }
      
      // Smooth rotation interpolation
      currentRotation.current = THREE.MathUtils.lerp(
        currentRotation.current,
        targetRotation.current,
        0.08
      );
      
      ringRef.current.rotation.y = currentRotation.current;
      
      // Subtle idle wobble
      if (!isActive) {
        ringRef.current.rotation.y += Math.sin(state.clock.elapsedTime * 0.5 + ringIndex * 2) * 0.002;
        ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + ringIndex) * 0.02;
      }
      
      // Open/close animation for password reveal
      const targetOffset = isOpen ? (ringIndex === 0 ? 0.4 : ringIndex === 2 ? -0.4 : 0) : 0;
      openOffset.current = THREE.MathUtils.lerp(openOffset.current, targetOffset, 0.05);
      ringRef.current.position.y = position[1] + openOffset.current;
    }
  });

  // Color scheme based on state
  const baseColor = '#1a1a1a'; // Obsidian
  const goldColor = '#c9a227'; // Antique gold
  const tealEmissive = '#14b8a6';
  const violetEmissive = '#8b5cf6';
  const activeEmissive = isActive ? (ringIndex === 1 ? violetEmissive : tealEmissive) : tealEmissive;

  return (
    <group ref={ringRef} position={position}>
      {/* Main ring - obsidian with gold inlay */}
      <mesh>
        <torusGeometry args={[radius, 0.08, 16, 64]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={activeEmissive}
          emissiveIntensity={isActive ? 0.3 + glowIntensity * 0.4 : 0.05}
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>
      
      {/* Gold accent ring */}
      <mesh>
        <torusGeometry args={[radius, 0.02, 8, 64]} />
        <meshStandardMaterial
          color={goldColor}
          emissive={goldColor}
          emissiveIntensity={0.2}
          metalness={1}
          roughness={0.3}
        />
      </mesh>
      
      {/* Inner decorative ring */}
      <mesh>
        <torusGeometry args={[radius - 0.1, 0.015, 8, 64]} />
        <meshStandardMaterial
          color={goldColor}
          emissive={activeEmissive}
          emissiveIntensity={isActive ? 0.4 : 0.1}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* Rune segments */}
      <group ref={runeGroupRef}>
        {runePositions.map((pos, i) => (
          <group key={i} position={[pos.x, 0, pos.z]} rotation={[0, -pos.angle + Math.PI / 2, 0]}>
            {/* Rune plate */}
            <mesh>
              <boxGeometry args={[0.15, 0.04, 0.06]} />
              <meshStandardMaterial
                color="#0a0a0a"
                emissive={activeEmissive}
                emissiveIntensity={isActive ? 0.6 + Math.sin(i + glowIntensity * 8) * 0.3 : 0.08}
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Holographic projected runes when typing (above the ring) */}
      {isActive && typedChars && (
        <group position={[0, 0.3, 0]}>
          {typedChars.split('').slice(-8).map((char, i) => {
            const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const projRadius = radius * 0.6;
            return (
              <Text
                key={i}
                position={[
                  Math.cos(angle) * projRadius,
                  0,
                  Math.sin(angle) * projRadius
                ]}
                rotation={[0, -angle + Math.PI / 2, 0]}
                fontSize={0.12}
                color={activeEmissive}
                anchorX="center"
                anchorY="middle"
              >
                {RUNES[char.charCodeAt(0) % RUNES.length]}
              </Text>
            );
          })}
        </group>
      )}
    </group>
  );
};
