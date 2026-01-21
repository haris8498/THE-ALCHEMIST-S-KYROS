import { useLocation } from 'react-router-dom';
import { PortalLayout } from '@/components/PortalLayout';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { GoldDustParticles } from '@/components/3d/GoldDustParticles';
import { useFrame } from '@react-three/fiber';
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
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
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
        <mesh>
          <icosahedronGeometry args={[0.6, 1]} />
          <meshStandardMaterial
            color="#c9a227"
            emissive="#c9a227"
            emissiveIntensity={0.4}
            wireframe
          />
        </mesh>
        
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

const Dashboard = () => {
  const location = useLocation();
  const username = location.state?.username || 'Alchemist';
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  return (
    <PortalLayout username={username}>
      <div className={`transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-[calc(100vh-180px)] rounded-xl overflow-hidden bg-black/40 border border-amber-900/30 backdrop-blur-xl">
          <Canvas 
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ 
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2
            }}
          >
            <Suspense fallback={null}>
              <fog attach="fog" args={['#0a0510', 5, 25]} />
              
              <ambientLight intensity={0.15} color="#2a1a3a" />
              <pointLight position={[10, 10, 10]} intensity={0.4} color="#14b8a6" />
              <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
              <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffd700" />
              
              <GoldDustParticles count={400} />
              
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
        </div>
      </div>
    </PortalLayout>
  );
};

export default Dashboard;
