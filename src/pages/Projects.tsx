import { useLocation } from 'react-router-dom';
import { PortalLayout } from '@/components/PortalLayout';
import { Calendar, Clock, CheckCircle2, AlertCircle, Play, Pause } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

// 3D Project Card
const ProjectCard3D = ({ position, title, status, color }: { 
  position: [number, number, number], 
  title: string, 
  status: string,
  color: string 
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group 
        ref={meshRef} 
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <boxGeometry args={[1.5, 1.8, 0.1]} />
          <meshStandardMaterial
            color="#0a0510"
            emissive={color}
            emissiveIntensity={hovered ? 0.4 : 0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[1.6, 1.9, 0.02]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
        <Text
          position={[0, 0.5, 0.1]}
          fontSize={0.12}
          color="#ffecd2"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.3}
        >
          {title}
        </Text>
        <Text
          position={[0, -0.5, 0.1]}
          fontSize={0.08}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {status}
        </Text>
      </group>
    </Float>
  );
};

const Projects = () => {
  const location = useLocation();
  const username = location.state?.username || 'Alchemist';

  const projects = [
    {
      id: 1,
      name: 'Quantum Transmutation Engine',
      description: 'Advanced particle transformation system',
      status: 'In Progress',
      progress: 75,
      dueDate: '2026-02-15',
      team: 5,
      color: 'bg-teal-900/20',
      borderColor: 'border-teal-700/30',
      textColor: 'text-teal-400',
      icon: Play
    },
    {
      id: 2,
      name: 'Celestial Navigation Protocol',
      description: 'Star-based positioning and routing',
      status: 'In Progress',
      progress: 45,
      dueDate: '2026-03-01',
      team: 3,
      color: 'bg-violet-900/20',
      borderColor: 'border-violet-700/30',
      textColor: 'text-violet-400',
      icon: Play
    },
    {
      id: 3,
      name: 'Essence Purification Matrix',
      description: 'Refinement and distillation framework',
      status: 'Completed',
      progress: 100,
      dueDate: '2026-01-20',
      team: 4,
      color: 'bg-emerald-900/20',
      borderColor: 'border-emerald-700/30',
      textColor: 'text-emerald-400',
      icon: CheckCircle2
    },
    {
      id: 4,
      name: 'Alchemical Database Nexus',
      description: 'Centralized knowledge repository',
      status: 'Planning',
      progress: 15,
      dueDate: '2026-04-10',
      team: 2,
      color: 'bg-amber-900/20',
      borderColor: 'border-amber-700/30',
      textColor: 'text-amber-400',
      icon: Pause
    },
    {
      id: 5,
      name: 'Philosopher\'s Stone API',
      description: 'Universal transformation interface',
      status: 'In Progress',
      progress: 60,
      dueDate: '2026-02-28',
      team: 6,
      color: 'bg-rose-900/20',
      borderColor: 'border-rose-700/30',
      textColor: 'text-rose-400',
      icon: Play
    },
    {
      id: 6,
      name: 'Elemental Balance System',
      description: 'Harmony maintenance protocols',
      status: 'Review',
      progress: 90,
      dueDate: '2026-01-25',
      team: 3,
      color: 'bg-blue-900/20',
      borderColor: 'border-blue-700/30',
      textColor: 'text-blue-400',
      icon: AlertCircle
    },
  ];

  const project3DData = [
    { position: [-2.5, 1, 0] as [number, number, number], title: 'Quantum Engine', status: 'ACTIVE', color: '#14b8a6' },
    { position: [0, 1, 0] as [number, number, number], title: 'Navigation', status: 'IN DEV', color: '#8b5cf6' },
    { position: [2.5, 1, 0] as [number, number, number], title: 'Purification', status: 'DONE', color: '#10b981' },
    { position: [-2.5, -1.5, 0] as [number, number, number], title: 'Database', status: 'PLANNING', color: '#fbbf24' },
    { position: [0, -1.5, 0] as [number, number, number], title: 'Stone API', status: 'ACTIVE', color: '#f43f5e' },
    { position: [2.5, -1.5, 0] as [number, number, number], title: 'Balance', status: 'REVIEW', color: '#3b82f6' },
  ];

  return (
    <PortalLayout username={username}>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Projects', value: '24', color: 'border-teal-700/30' },
            { label: 'In Progress', value: '12', color: 'border-violet-700/30' },
            { label: 'Completed', value: '8', color: 'border-emerald-700/30' },
            { label: 'Team Members', value: '23', color: 'border-amber-700/30' },
          ].map((stat, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl bg-black/40 border ${stat.color} backdrop-blur-xl text-center`}
            >
              <p className="text-2xl font-bold text-amber-100">{stat.value}</p>
              <p className="text-xs text-amber-200/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 3D Project Visualization */}
        <div className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-amber-100 mb-4 tracking-wider">PROJECT CONSTELLATION</h2>
          <div className="h-[500px] rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={0.6} color="#14b8a6" />
                <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
                {project3DData.map((project, index) => (
                  <ProjectCard3D
                    key={index}
                    position={project.position}
                    title={project.title}
                    status={project.status}
                    color={project.color}
                  />
                ))}
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <div
                key={project.id}
                className={`p-6 rounded-xl ${project.color} border ${project.borderColor} backdrop-blur-xl hover:scale-105 transition-all duration-300 cursor-pointer group`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-100 group-hover:text-amber-50 transition-colors mb-2">
                      {project.name}
                    </h3>
                    <p className="text-sm text-amber-200/60 mb-4">{project.description}</p>
                  </div>
                  <Icon className={`w-6 h-6 ${project.textColor}`} />
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-amber-200/50">Progress</span>
                    <span className={`text-xs font-bold ${project.textColor}`}>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${project.textColor.replace('text-', 'bg-')} transition-all duration-500`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-amber-200/50">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{project.team} members</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
};

export default Projects;
