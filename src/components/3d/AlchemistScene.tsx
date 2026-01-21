import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { GoldDustParticles } from './GoldDustParticles';
import { ReflectiveFloor } from './ReflectiveFloor';
import { CelestialSphere } from './CelestialSphere';
import * as THREE from 'three';

interface SceneProps {
  activeField: 'none' | 'username' | 'password';
  username: string;
  password: string;
  isPasswordRevealed: boolean;
  isAssembled: boolean;
  hasError: boolean;
  onAssemblyComplete: () => void;
}

const CameraController = ({ activeField }: { activeField: string }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [targetPosition, setTargetPosition] = useState<[number, number, number]>([0, 0.5, 5]);
  const [targetLookAt, setTargetLookAt] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    // Camera shifts based on active field
    if (activeField === 'password') {
      // 35-degree isometric shift for password
      setTargetPosition([2, 1.5, 4]);
      setTargetLookAt([0, -0.2, 0]);
    } else if (activeField === 'username') {
      setTargetPosition([-0.5, 1, 5]);
      setTargetLookAt([0, 0.3, 0]);
    } else {
      setTargetPosition([0, 0.5, 5]);
      setTargetLookAt([0, 0, 0]);
    }
  }, [activeField]);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={targetPosition}
      fov={50}
    />
  );
};

export const AlchemistScene = ({
  activeField,
  username,
  password,
  isPasswordRevealed,
  isAssembled,
  hasError,
  onAssemblyComplete
}: SceneProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <CameraController activeField={activeField} />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#0a0510', 5, 20]} />
          
          {/* Ambient lighting - deep purple */}
          <ambientLight intensity={0.15} color="#2a1a3a" />
          
          {/* Teal rim light */}
          <directionalLight
            position={[5, 3, -5]}
            intensity={0.4}
            color="#14b8a6"
          />
          
          {/* Violet accent light */}
          <directionalLight
            position={[-5, 2, 5]}
            intensity={0.3}
            color="#8b5cf6"
          />
          
          {/* Warm gold fill */}
          <pointLight
            position={[0, 3, 0]}
            intensity={0.5}
            color="#ffd700"
            distance={10}
          />
          
          {/* Background particles - gold dust */}
          <GoldDustParticles count={600} mousePosition={mousePosition} />
          
          {/* Reflective water floor */}
          <ReflectiveFloor />
          
          {/* Main celestial sphere */}
          <CelestialSphere
            activeField={activeField}
            username={username}
            password={password}
            isPasswordRevealed={isPasswordRevealed}
            isAssembled={isAssembled}
            hasError={hasError}
            onAssemblyComplete={onAssemblyComplete}
          />
          
          {/* Camera controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 4}
            autoRotate={activeField === 'none'}
            autoRotateSpeed={0.3}
            dampingFactor={0.05}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
