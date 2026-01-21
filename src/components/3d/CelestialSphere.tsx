import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialRing } from './CelestialRing';
import { CelestialCore } from './CelestialCore';

interface CelestialSphereProps {
  activeField: 'none' | 'username' | 'password';
  username: string;
  password: string;
  isPasswordRevealed: boolean;
  isAssembled: boolean;
  hasError: boolean;
  onAssemblyComplete: () => void;
}

export const CelestialSphere = ({
  activeField,
  username,
  password,
  isPasswordRevealed,
  isAssembled,
  hasError,
  onAssemblyComplete
}: CelestialSphereProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  
  // Track typing
  const prevUsernameLength = useRef(username.length);
  const prevPasswordLength = useRef(password.length);
  const [isTypingUsername, setIsTypingUsername] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  useEffect(() => {
    if (username.length !== prevUsernameLength.current) {
      setIsTypingUsername(true);
      prevUsernameLength.current = username.length;
      setTimeout(() => setIsTypingUsername(false), 150);
    }
  }, [username.length]);

  useEffect(() => {
    if (password.length !== prevPasswordLength.current) {
      setIsTypingPassword(true);
      prevPasswordLength.current = password.length;
      setTimeout(() => setIsTypingPassword(false), 150);
    }
  }, [password.length]);

  // Assembly animation
  useEffect(() => {
    if (!isAssembled) {
      const interval = setInterval(() => {
        setAssemblyProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval);
            onAssemblyComplete();
            return 1;
          }
          return prev + 0.015;
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      setAssemblyProgress(1);
    }
  }, [isAssembled, onAssemblyComplete]);

  // Error shake effect
  useEffect(() => {
    if (hasError) {
      setShakeIntensity(1);
      const decay = setInterval(() => {
        setShakeIntensity(prev => {
          if (prev <= 0.01) {
            clearInterval(decay);
            return 0;
          }
          return prev * 0.9;
        });
      }, 30);
      return () => clearInterval(decay);
    }
  }, [hasError]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Gentle floating
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.1;
      
      // Subtle rotation
      groupRef.current.rotation.y = Math.sin(time * 0.15) * 0.15;
      
      // Error shake
      if (shakeIntensity > 0) {
        groupRef.current.position.x = (Math.random() - 0.5) * shakeIntensity * 0.3;
        groupRef.current.rotation.z = (Math.random() - 0.5) * shakeIntensity * 0.1;
      } else {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.1);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      }
    }
  });

  // Fragment explosion positions during assembly
  const getFragmentTransform = (index: number, progress: number) => {
    const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    const angle = (index / 4) * Math.PI * 2 + Math.PI / 4;
    const distance = (1 - eased) * 6;
    const height = (1 - eased) * (index - 1.5) * 2;
    const rotation = (1 - eased) * Math.PI * 2;
    
    return {
      position: [
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
      ] as [number, number, number],
      rotation: rotation,
      opacity: eased
    };
  };

  const ring0 = getFragmentTransform(0, assemblyProgress);
  const ring1 = getFragmentTransform(1, assemblyProgress);
  const ring2 = getFragmentTransform(2, assemblyProgress);
  const core = getFragmentTransform(3, assemblyProgress);

  return (
    <group ref={groupRef}>
      {/* Top ring - Username (large outer ring) */}
      <group 
        position={ring0.position}
        rotation={[ring0.rotation * 0.5, ring0.rotation, 0]}
      >
        <CelestialRing
          radius={1.2}
          position={[0, 0.4, 0]}
          isActive={activeField === 'username'}
          isTyping={isTypingUsername}
          ringIndex={0}
          glowIntensity={username.length * 0.08}
          typedChars={username}
        />
      </group>
      
      {/* Middle ring - Password (medium ring) */}
      <group 
        position={ring1.position}
        rotation={[-ring1.rotation * 0.3, ring1.rotation, ring1.rotation * 0.2]}
      >
        <CelestialRing
          radius={1.0}
          position={[0, 0, 0]}
          isActive={activeField === 'password'}
          isTyping={isTypingPassword}
          ringIndex={1}
          glowIntensity={password.length * 0.08}
          isOpen={isPasswordRevealed}
          typedChars={password}
        />
      </group>
      
      {/* Bottom ring - Decorative (smaller ring) */}
      <group 
        position={ring2.position}
        rotation={[ring2.rotation * 0.4, -ring2.rotation, 0]}
      >
        <CelestialRing
          radius={0.8}
          position={[0, -0.4, 0]}
          isActive={false}
          isTyping={false}
          ringIndex={2}
          glowIntensity={0.15}
          isOpen={isPasswordRevealed}
        />
      </group>
      
      {/* Central core */}
      <group position={core.position}>
        <CelestialCore
          isRevealed={isPasswordRevealed}
          intensity={password.length * 0.08}
        />
      </group>
      
      {/* Connecting struts between rings */}
      {assemblyProgress > 0.8 && [...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}
            rotation={[0, angle, 0]}
          >
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
            <meshStandardMaterial
              color="#c9a227"
              emissive="#c9a227"
              emissiveIntensity={0.3}
              metalness={1}
              roughness={0.3}
              transparent
              opacity={(assemblyProgress - 0.8) * 5}
            />
          </mesh>
        );
      })}
    </group>
  );
};
