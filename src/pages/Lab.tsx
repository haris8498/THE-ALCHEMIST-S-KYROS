import { useLocation } from 'react-router-dom';
import { PortalLayout } from '@/components/PortalLayout';
import { Beaker, Flame, Droplet, Wind, Sparkles, Zap } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import * as THREE from 'three';

// Interactive Element Sphere
const ElementSphere = ({ 
  position, 
  color, 
  emissive,
  onClick,
  isSelected
}: { 
  position: [number, number, number], 
  color: string,
  emissive: string,
  onClick: () => void,
  isSelected: boolean
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const scale = isSelected ? 1.5 : hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Sphere args={[0.6, 32, 32]}>
          <MeshDistortMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={isSelected ? 2.0 : hovered ? 1.2 : 0.5}
            metalness={0.8}
            roughness={0.2}
            distort={isSelected ? 0.5 : 0.3}
            speed={isSelected ? 4 : 2}
          />
        </Sphere>
      </mesh>
    </Float>
  );
};

// Central Transmutation Chamber
const TransmutationChamber = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer ring */}
      <Torus args={[2.5, 0.05, 16, 100]}>
        <meshStandardMaterial
          color="#c9a227"
          emissive="#ffd700"
          emissiveIntensity={0.8}
        />
      </Torus>
      
      {/* Middle ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#14b8a6"
          emissive="#14b8a6"
          emissiveIntensity={0.6}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[2.1, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
};

const Lab = () => {
  const location = useLocation();
  const username = location.state?.username || 'Alchemist';
  const { theme } = useTheme();
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [transmutationResult, setTransmutationResult] = useState<string>('');
  const [isTransmuting, setIsTransmuting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const elements = [
    { name: 'Fire', position: [-3, 1.5, 0] as [number, number, number], color: '#ef4444', emissive: '#dc2626', icon: Flame },
    { name: 'Water', position: [3, 1.5, 0] as [number, number, number], color: '#3b82f6', emissive: '#2563eb', icon: Droplet },
    { name: 'Earth', position: [-3, -1.5, 0] as [number, number, number], color: '#10b981', emissive: '#059669', icon: Sparkles },
    { name: 'Air', position: [3, -1.5, 0] as [number, number, number], color: '#14b8a6', emissive: '#0d9488', icon: Wind },
  ];

  const handleElementClick = (elementName: string) => {
    setSelectedElements(prev => {
      if (prev.includes(elementName)) {
        return prev.filter(e => e !== elementName);
      } else {
        return [...prev, elementName];
      }
    });
  };

  const performTransmutation = () => {
    if (selectedElements.length === 0) {
      setTransmutationResult('⚠️ Select at least one element to transmute!');
      setShowResult(true);
      setTimeout(() => setShowResult(false), 3000);
      return;
    }

    setIsTransmuting(true);
    setShowResult(false);

    // Simulate transmutation process
    setTimeout(() => {
      const combinations: { [key: string]: string } = {
        'Air': '🌪️ Pure Wind Essence - Breath of the Ancients',
        'Earth': '🪨 Solid Terra - Foundation Stone',
        'Fire': '🔥 Eternal Flame - Phoenix Fire',
        'Water': '💧 Aqua Vitae - Life Water',
        'Air,Fire': '⚡ Lightning - Celestial Spark',
        'Air,Earth': '💨 Dust Storm - Ancient Particles',
        'Air,Water': '☁️ Cloud - Sky Essence',
        'Earth,Fire': '🌋 Lava - Molten Stone',
        'Earth,Water': '🏞️ Mud - Primordial Clay',
        'Fire,Water': '💨 Steam - Ethereal Vapor',
        'Air,Earth,Fire': '☄️ Meteor - Cosmic Fragment',
        'Air,Fire,Water': '⛈️ Storm - Tempest Energy',
        'Air,Earth,Water': '🌱 Life - Genesis Force',
        'Earth,Fire,Water': '🖤 Obsidian - Volcanic Glass',
        'Air,Earth,Fire,Water': '💎 PHILOSOPHER\'S STONE - Ultimate Creation!',
      };

      const key = selectedElements.sort().join(',');
      const result = combinations[key] || '🧪 Unknown Compound - Experimental Matter';
      setTransmutationResult(result);
      setIsTransmuting(false);
      setShowResult(true);
    }, 2000);
  };

  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        // Keep result visible
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  const experiments = [
    { name: 'Essence Extraction', status: 'Completed', success: '98%', color: 'border-emerald-700/30' },
    { name: 'Quantum Fusion', status: 'In Progress', success: '67%', color: 'border-teal-700/30' },
    { name: 'Elemental Binding', status: 'Failed', success: '12%', color: 'border-red-700/30' },
    { name: 'Astral Refinement', status: 'Pending', success: '0%', color: 'border-amber-700/30' },
  ];

  return (
    <PortalLayout username={username}>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Lab Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Experiments', value: '156', icon: Beaker },
            { label: 'Success Rate', value: '87%', icon: Sparkles },
            { label: 'Active Formulas', value: '23', icon: Flame },
            { label: 'Discoveries', value: '42', icon: Droplet },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-xl backdrop-blur-xl hover:scale-105 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-black/40 border border-amber-900/30'
                    : 'bg-white/60 border border-amber-600/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-6 h-6 text-amber-400" />
                  <span className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-amber-100' : 'text-amber-900'
                  }`}>{stat.value}</span>
                </div>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-amber-200/50' : 'text-amber-700/60'
                }`}>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* 3D Transmutation Chamber */}
        <div className={`p-6 rounded-xl backdrop-blur-xl ${
          theme === 'dark'
            ? 'bg-black/40 border border-amber-900/30'
            : 'bg-white/60 border border-amber-600/30'
        }`}>
          <h2 className={`text-lg font-bold mb-4 tracking-wider ${
            theme === 'dark' ? 'text-amber-100' : 'text-amber-900'
          }`}>TRANSMUTATION CHAMBER</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Scene */}
            <div className="lg:col-span-2">
              <div className={`h-[500px] rounded-lg overflow-hidden ${
                theme === 'dark' ? 'bg-black/20' : 'bg-gray-200/40'
              }`}>
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
                    
                    {/* Central Chamber */}
                    <TransmutationChamber />
                    
                    {/* Element Spheres */}
                    {elements.map((element, index) => (
                      <ElementSphere
                        key={index}
                        position={element.position}
                        color={element.color}
                        emissive={element.emissive}
                        onClick={() => handleElementClick(element.name)}
                        isSelected={selectedElements.includes(element.name)}
                      />
                    ))}
                    
                    {/* Central Core */}
                    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
                      <Sphere args={[0.8, 32, 32]}>
                        <MeshDistortMaterial
                          color="#ffd700"
                          emissive="#ffd700"
                          emissiveIntensity={1.5}
                          metalness={0.9}
                          roughness={0.1}
                          distort={0.5}
                          speed={3}
                        />
                      </Sphere>
                    </Float>
                  </Suspense>
                </Canvas>
              </div>
            </div>

            {/* Control Panel */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-black/20 border-amber-900/20'
                  : 'bg-white/40 border-amber-600/20'
              }`}>
                <h3 className={`text-sm font-bold mb-3 tracking-wider ${
                  theme === 'dark' ? 'text-amber-100' : 'text-amber-900'
                }`}>SELECTED ELEMENTS ({selectedElements.length}/4)</h3>
                <div className="space-y-2 mb-4">
                  {elements.map((element) => {
                    const Icon = element.icon;
                    const isSelected = selectedElements.includes(element.name);
                    return (
                      <button
                        key={element.name}
                        onClick={() => handleElementClick(element.name)}
                        disabled={isTransmuting}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          isSelected
                            ? theme === 'dark'
                              ? 'bg-amber-900/40 border border-amber-700/40'
                              : 'bg-amber-200/60 border border-amber-600/40'
                            : theme === 'dark'
                              ? 'bg-black/20 border border-amber-900/20 hover:bg-amber-900/20'
                              : 'bg-white/30 border border-amber-600/20 hover:bg-amber-100/40'
                        }`}
                      >
                        <Icon className="w-4 h-4" style={{ color: element.color }} />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-amber-100' : 'text-amber-900'
                        }`}>{element.name}</span>
                        {isSelected && <span className="ml-auto text-amber-400 text-xs font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={performTransmutation}
                  disabled={isTransmuting}
                  className={`w-full px-4 py-3 rounded-lg transition-all font-bold tracking-wider flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-amber-900/40 to-violet-900/40 hover:from-amber-900/60 hover:to-violet-900/60 border border-amber-700/40 text-amber-100'
                      : 'bg-gradient-to-r from-amber-600/40 to-violet-600/40 hover:from-amber-600/60 hover:to-violet-600/60 border border-amber-700/50 text-amber-900'
                  }`}
                >
                  {isTransmuting ? (
                    <>
                      <Zap className="w-4 h-4 animate-pulse" />
                      TRANSMUTING...
                    </>
                  ) : (
                    'TRANSMUTE'
                  )}
                </button>
              </div>

              {showResult && transmutationResult && (
                <div className={`p-4 rounded-lg border animate-in fade-in slide-in-from-bottom duration-500 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-amber-900/20 to-violet-900/20 border-amber-700/30'
                    : 'bg-gradient-to-br from-amber-200/40 to-violet-200/40 border-amber-600/40'
                }`}>
                  <h3 className={`text-xs font-bold mb-2 tracking-wider ${
                    theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
                  }`}>✨ TRANSMUTATION RESULT</h3>
                  <p className={`text-sm font-medium leading-relaxed ${
                    theme === 'dark' ? 'text-amber-100' : 'text-amber-900'
                  }`}>{transmutationResult}</p>
                </div>
              )}

              <div className={`p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-black/20 border-amber-900/20'
                  : 'bg-white/40 border-amber-600/20'
              }`}>
                <h3 className={`text-xs font-bold mb-2 tracking-wider ${
                  theme === 'dark' ? 'text-amber-200/50' : 'text-amber-700/70'
                }`}>📖 INSTRUCTIONS</h3>
                <p className={`text-xs leading-relaxed ${
                  theme === 'dark' ? 'text-amber-200/40' : 'text-amber-700/60'
                }`}>
                  Click on element spheres (both in 3D chamber and buttons) to select them. Combine 1-4 elements and click TRANSMUTE to discover compounds. Try all combinations!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Experiments */}
        <div className={`p-6 rounded-xl backdrop-blur-xl ${
          theme === 'dark'
            ? 'bg-black/40 border border-amber-900/30'
            : 'bg-white/60 border border-amber-600/30'
        }`}>
          <h2 className={`text-lg font-bold mb-4 tracking-wider ${
            theme === 'dark' ? 'text-amber-100' : 'text-amber-900'
          }`}>RECENT EXPERIMENTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiments.map((exp, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${exp.color} transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-black/20 hover:bg-black/30'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-bold ${
                    theme === 'dark' ? 'text-amber-100' : 'text-amber-900'
                  }`}>{exp.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    exp.status === 'Completed' ? 'bg-emerald-900/40 text-emerald-400' :
                    exp.status === 'In Progress' ? 'bg-teal-900/40 text-teal-400' :
                    exp.status === 'Failed' ? 'bg-red-900/40 text-red-400' :
                    'bg-amber-900/40 text-amber-400'
                  }`}>
                    {exp.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-amber-200/50' : 'text-amber-700/60'
                  }`}>Success Rate</span>
                  <span className="text-sm font-bold text-amber-400">{exp.success}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Lab;
