import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { GoldDustParticles } from './3d/GoldDustParticles';
import * as THREE from 'three';

interface DashboardCardProps {
  position: [number, number, number];
  title: string;
  value: string;
  color: string;
}

const DashboardCard = ({ position, title, value, color }: DashboardCardProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // Pulsing scale on hover
      const targetScale = hovered ? 1.1 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group 
        ref={groupRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Card background - obsidian */}
        <mesh>
          <boxGeometry args={[2.2, 1.4, 0.08]} />
          <meshStandardMaterial
            color="#0a0510"
            emissive={color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
            metalness={0.95}
            roughness={0.1}
            transparent
            opacity={0.95}
          />
        </mesh>
        
        {/* Gold frame */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[2.3, 1.5, 0.02]} />
          <meshStandardMaterial
            color="#c9a227"
            emissive="#c9a227"
            emissiveIntensity={hovered ? 0.6 : 0.3}
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
        
        {/* Title */}
        <Text
          position={[0, 0.35, 0.1]}
          fontSize={0.1}
          color="#c9a227"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          {title}
        </Text>
        
        {/* Value */}
        <Text
          position={[0, -0.1, 0.1]}
          fontSize={0.28}
          color="#ffecd2"
          anchorX="center"
          anchorY="middle"
        >
          {value}
        </Text>
      </group>
    </Float>
  );
};

// Central alchemical orb
const AlchemicalOrb = () => {
  const orbRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -state.clock.elapsedTime * 0.7;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={orbRef} position={[0, 0, 1.5]}>
        {/* Outer wireframe sphere */}
        <mesh>
          <icosahedronGeometry args={[0.6, 1]} />
          <meshStandardMaterial
            color="#c9a227"
            emissive="#c9a227"
            emissiveIntensity={0.4}
            wireframe
          />
        </mesh>
        
        {/* Inner glowing core */}
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color="#ffecd2"
            emissive="#ffd700"
            emissiveIntensity={1}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Orbiting rings */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.5, 0.015, 8, 64]} />
          <meshStandardMaterial
            color="#14b8a6"
            emissive="#14b8a6"
            emissiveIntensity={0.6}
          />
        </mesh>
        
        <mesh ref={ring2Ref} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
          <torusGeometry args={[0.55, 0.01, 8, 64]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        <pointLight color="#ffd700" intensity={2} distance={5} />
      </group>
    </Float>
  );
};

interface Dashboard3DProps {
  username: string;
  onLogout: () => void;
}

export const Dashboard3D = ({ username, onLogout }: Dashboard3DProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  // Trigger fade-in animation on mount
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
    setTimeout(() => setShowLoading(false), 1500);
  }, []);

  return (
    <div 
      className={`absolute inset-0 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: '#0a0510' }}
    >
      {/* 3D Scene */}
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          {/* Fog */}
          <fog attach="fog" args={['#0a0510', 5, 25]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.15} color="#2a1a3a" />
          <pointLight position={[10, 10, 10]} intensity={0.4} color="#14b8a6" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffd700" />
          
          {/* Background particles */}
          <GoldDustParticles count={400} />
          
          {/* Welcome text */}
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
            <Text
              position={[0, 2.8, 0]}
              fontSize={0.25}
              color="#c9a227"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.3}
            >
              WELCOME, ALCHEMIST
            </Text>
            <Text
              position={[0, 2.4, 0]}
              fontSize={0.5}
              color="#ffecd2"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.1}
            >
              {username.toUpperCase()}
            </Text>
          </Float>
          
          {/* Dashboard cards */}
          <DashboardCard
            position={[-2.8, 0.5, 0]}
            title="TRANSMUTATION STATUS"
            value="ACTIVE"
            color="#14b8a6"
          />
          
          <DashboardCard
            position={[2.8, 0.5, 0]}
            title="ARCANE LEVEL"
            value="ADEPT"
            color="#8b5cf6"
          />
          
          <DashboardCard
            position={[-2.8, -1.3, 0]}
            title="PHILOSOPHER STONES"
            value="∞"
            color="#ffd700"
          />
          
          <DashboardCard
            position={[2.8, -1.3, 0]}
            title="ESSENCE PURITY"
            value="99.9%"
            color="#14b8a6"
          />
          
          {/* Central orb */}
          <AlchemicalOrb />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            autoRotate
            autoRotateSpeed={0.2}
          />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className={`absolute top-6 right-6 z-10 transition-all duration-700 delay-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <button
          onClick={onLogout}
          className="px-6 py-3 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-700/40 text-amber-200/80 hover:text-amber-100 rounded-lg font-medium tracking-[0.15em] transition-all hover:shadow-lg hover:shadow-amber-900/20 text-sm"
        >
          SEVER CONNECTION
        </button>
      </div>
      
      {/* Top navigation bar */}
      <div className={`absolute top-6 left-6 z-10 transition-all duration-700 delay-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-violet-900/20 border border-violet-700/30 rounded-lg">
            <span className="text-violet-200/70 text-xs tracking-[0.15em] uppercase">
              ⬡ Alchemist Portal
            </span>
          </div>
          <div className="px-6 py-3 bg-teal-900/20 border border-teal-700/30 rounded-lg">
            <span className="text-teal-200/70 text-xs tracking-[0.15em] uppercase">
              ⬡ Real-time Transmutation
            </span>
          </div>
        </div>
      </div>
      
      {/* Bottom status bar */}
      <div className={`absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent transition-all duration-700 delay-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex justify-between items-center max-w-5xl mx-auto text-amber-200/50 text-xs font-mono tracking-[0.1em]">
          <span>⬡ SESSION: BOUND</span>
          <span>⬡ IDENTITY: {username.toUpperCase()}</span>
          <span>⬡ SEAL: PHILOSOPHER&apos;S CIPHER</span>
        </div>
      </div>

      {/* Loading overlay */}
      {showLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0510] transition-opacity duration-1000" style={{ opacity: fadeIn ? 0 : 1 }}>
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-2 border-amber-600/30 rounded-full animate-ping" />
              <div className="absolute inset-2 border-2 border-teal-500/40 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-4 border-2 border-violet-500/40 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
              <div className="absolute inset-6 bg-amber-500/20 rounded-full animate-pulse" />
            </div>
            <p className="text-amber-100/60 text-base tracking-[0.3em] uppercase mb-2">
              Entering the Sanctum...
            </p>
            <p className="text-amber-100/30 text-xs tracking-[0.2em] uppercase">
              Welcome, {username}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
