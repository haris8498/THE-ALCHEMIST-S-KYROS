import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ReflectiveFloor = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useRef({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#0a0510') },
    uColor2: { value: new THREE.Color('#1a0a20') },
  });

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      // Subtle ripple effect
      float ripple = sin(pos.x * 2.0 + uTime * 0.5) * cos(pos.z * 2.0 + uTime * 0.3) * 0.05;
      pos.y += ripple;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    void main() {
      // Distance-based fade
      float dist = length(vPosition.xz) / 10.0;
      float alpha = smoothstep(1.0, 0.0, dist);
      
      // Subtle gradient
      vec3 color = mix(uColor1, uColor2, vUv.y);
      
      // Ripple highlights
      float ripple = sin(vPosition.x * 3.0 + uTime * 0.5) * cos(vPosition.z * 3.0 + uTime * 0.3);
      color += vec3(0.1, 0.05, 0.15) * ripple * 0.3;
      
      gl_FragColor = vec4(color, alpha * 0.6);
    }
  `;

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -2.5, 0]}
    >
      <planeGeometry args={[30, 30, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
