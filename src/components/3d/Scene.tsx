import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import { Particles } from './Particles';
import { Cylinder } from './Cylinder';
import * as THREE from 'three';

interface SceneProps {
  activeField: 'none' | 'username' | 'password';
  usernameLength: number;
  passwordLength: number;
  isPasswordRevealed: boolean;
  isAssembled: boolean;
  onAssemblyComplete: () => void;
}

const CameraController = ({ activeField }: { activeField: string }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useEffect(() => {
    // Camera will be controlled by OrbitControls, but we set initial position
  }, [activeField]);
  
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 1, 5]}
      fov={60}
    />
  );
};

export const Scene = ({
  activeField,
  usernameLength,
  passwordLength,
  isPasswordRevealed,
  isAssembled,
  onAssemblyComplete
}: SceneProps) => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <Suspense fallback={null}>
          <CameraController activeField={activeField} />
          
          {/* Lighting */}
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff00ff" />
          <spotLight
            position={[0, 5, 0]}
            angle={0.5}
            penumbra={1}
            intensity={0.5}
            color="#00ffff"
          />
          
          {/* Background particles */}
          <Particles count={300} />
          
          {/* Main cylinder */}
          <Cylinder
            activeField={activeField}
            usernameLength={usernameLength}
            passwordLength={passwordLength}
            isPasswordRevealed={isPasswordRevealed}
            isAssembled={isAssembled}
            onAssemblyComplete={onAssemblyComplete}
          />
          
          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            autoRotate={activeField === 'none'}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
