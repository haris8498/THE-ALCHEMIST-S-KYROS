import { useLocation } from 'react-router-dom';
import { PortalLayout } from '@/components/PortalLayout';
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, Target } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Animated chart bars in 3D
const ChartBar = ({ position, height, color }: { position: [number, number, number], height: number, color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1 + height / 2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.3, height, 0.3]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

const Chart3D = () => {
  const data = [
    { x: -2, height: 1.5, color: '#14b8a6' },
    { x: -1.5, height: 2.2, color: '#14b8a6' },
    { x: -1, height: 1.8, color: '#8b5cf6' },
    { x: -0.5, height: 2.5, color: '#8b5cf6' },
    { x: 0, height: 2.0, color: '#ffd700' },
    { x: 0.5, height: 2.8, color: '#ffd700' },
    { x: 1, height: 2.3, color: '#14b8a6' },
    { x: 1.5, height: 3.0, color: '#14b8a6' },
  ];

  return (
    <>
      {data.map((bar, i) => (
        <ChartBar key={i} position={[bar.x, 0, 0]} height={bar.height} color={bar.color} />
      ))}
      <gridHelper args={[10, 10, '#c9a227', '#c9a227']} rotation={[0, 0, 0]} position={[0, -0.01, 0]} />
    </>
  );
};

const Analytics = () => {
  const location = useLocation();
  const username = location.state?.username || 'Alchemist';

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$124,592',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-900/20',
      borderColor: 'border-emerald-700/30'
    },
    {
      title: 'Active Projects',
      value: '42',
      change: '+8.2%',
      trend: 'up',
      icon: Target,
      color: 'text-violet-400',
      bgColor: 'bg-violet-900/20',
      borderColor: 'border-violet-700/30'
    },
    {
      title: 'Total Users',
      value: '2,847',
      change: '+23.1%',
      trend: 'up',
      icon: Users,
      color: 'text-amber-400',
      bgColor: 'bg-amber-900/20',
      borderColor: 'border-amber-700/30'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-2.4%',
      trend: 'down',
      icon: Activity,
      color: 'text-teal-400',
      bgColor: 'bg-teal-900/20',
      borderColor: 'border-teal-700/30'
    },
  ];

  return (
    <PortalLayout username={username}>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
            return (
              <div
                key={index}
                className={`p-6 rounded-xl ${metric.bgColor} border ${metric.borderColor} backdrop-blur-xl hover:scale-105 transition-all duration-300 cursor-pointer group`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${metric.color}`} />
                  <div className={`flex items-center gap-1 text-xs ${metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    <TrendIcon className="w-3 h-3" />
                    <span>{metric.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-amber-100 mb-1 group-hover:text-amber-50 transition-colors">
                  {metric.value}
                </h3>
                <p className="text-sm text-amber-200/50">{metric.title}</p>
              </div>
            );
          })}
        </div>

        {/* 3D Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-amber-100 mb-4 tracking-wider">PERFORMANCE CHART</h2>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.3} />
                  <pointLight position={[10, 10, 10]} intensity={0.8} color="#14b8a6" />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
                  <Chart3D />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Suspense>
              </Canvas>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-amber-100 mb-4 tracking-wider">RECENT ACTIVITY</h2>
            <div className="space-y-4">
              {[
                { action: 'New project created', time: '2 minutes ago', color: 'text-emerald-400' },
                { action: 'User registration spike', time: '15 minutes ago', color: 'text-violet-400' },
                { action: 'Revenue milestone reached', time: '1 hour ago', color: 'text-amber-400' },
                { action: 'System optimization completed', time: '3 hours ago', color: 'text-teal-400' },
                { action: 'Analytics report generated', time: '5 hours ago', color: 'text-blue-400' },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-amber-900/20 hover:border-amber-700/40 transition-all cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${activity.color}`}>{activity.action}</p>
                    <p className="text-xs text-amber-200/40 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Avg. Session Duration', value: '4m 32s', color: 'border-teal-700/30' },
            { label: 'Bounce Rate', value: '32.4%', color: 'border-violet-700/30' },
            { label: 'Page Views', value: '18,429', color: 'border-amber-700/30' },
          ].map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl bg-black/40 border ${stat.color} backdrop-blur-xl text-center hover:scale-105 transition-all duration-300`}
            >
              <p className="text-3xl font-bold text-amber-100 mb-2">{stat.value}</p>
              <p className="text-sm text-amber-200/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default Analytics;
