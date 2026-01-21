import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CylinderRing } from './CylinderRing';
import { CylinderCore } from './CylinderCore';

interface CylinderProps {
  activeField: 'none' | 'username' | 'password';
  usernameLength: number;
  passwordLength: number;
  isPasswordRevealed: boolean;
  isAssembled: boolean;
  onAssemblyComplete: () => void;
}

export const Cylinder = ({
  activeField,
  usernameLength,
  passwordLength,
  isPasswordRevealed,
  isAssembled,
  onAssemblyComplete
}: CylinderProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [localAssembled, setLocalAssembled] = useState(false);
  
  // Track typing
  const prevUsernameLength = useRef(usernameLength);
  const prevPasswordLength = useRef(passwordLength);
  const [isTypingUsername, setIsTypingUsername] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  useEffect(() => {
    if (usernameLength !== prevUsernameLength.current) {
      setIsTypingUsername(true);
      prevUsernameLength.current = usernameLength;
      setTimeout(() => setIsTypingUsername(false), 200);
    }
  }, [usernameLength]);

  useEffect(() => {
    if (passwordLength !== prevPasswordLength.current) {
      setIsTypingPassword(true);
      prevPasswordLength.current = passwordLength;
      setTimeout(() => setIsTypingPassword(false), 200);
    }
  }, [passwordLength]);

  // Assembly animation
  useEffect(() => {
    if (!isAssembled) {
      const interval = setInterval(() => {
        setAssemblyProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval);
            setLocalAssembled(true);
            onAssemblyComplete();
            return 1;
          }
          return prev + 0.02;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAssembled, onAssemblyComplete]);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Camera-following subtle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  // Calculate fragment positions during assembly
  const getFragmentOffset = (index: number, progress: number) => {
    if (progress >= 1) return [0, 0, 0];
    
    const angle = (index / 3) * Math.PI * 2;
    const distance = (1 - progress) * 8;
    const height = (1 - progress) * (index - 1) * 3;
    
    return [
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    ];
  };

  const fragment0 = getFragmentOffset(0, assemblyProgress);
  const fragment1 = getFragmentOffset(1, assemblyProgress);
  const fragment2 = getFragmentOffset(2, assemblyProgress);

  return (
    <group ref={groupRef}>
      {/* Top ring - Username */}
      <group position={[fragment0[0], fragment0[1], fragment0[2]]}>
        <CylinderRing
          position={[0, 0.5, 0]}
          isActive={activeField === 'username'}
          isTyping={isTypingUsername}
          ringIndex={0}
          glowIntensity={usernameLength * 0.1}
        />
      </group>
      
      {/* Middle ring - Password */}
      <group position={[fragment1[0], fragment1[1], fragment1[2]]}>
        <CylinderRing
          position={[0, 0, 0]}
          isActive={activeField === 'password'}
          isTyping={isTypingPassword}
          ringIndex={1}
          glowIntensity={passwordLength * 0.1}
          isOpen={isPasswordRevealed}
        />
      </group>
      
      {/* Core */}
      <group position={[fragment2[0], fragment2[1], fragment2[2]]}>
        <CylinderCore
          isRevealed={isPasswordRevealed}
          intensity={passwordLength * 0.1}
        />
      </group>
      
      {/* Bottom ring - Decorative */}
      <group position={[fragment2[0], fragment2[1] - 0.5, fragment2[2]]}>
        <CylinderRing
          position={[0, -0.5, 0]}
          isActive={false}
          isTyping={false}
          ringIndex={2}
          glowIntensity={0.2}
        />
      </group>
      
      {/* Central column */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#00ffff"
          emissiveIntensity={0.1}
          metalness={0.95}
          roughness={0.1}
          transparent
          opacity={assemblyProgress}
        />
      </mesh>
    </group>
  );
};
