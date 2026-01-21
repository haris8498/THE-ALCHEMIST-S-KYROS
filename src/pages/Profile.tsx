import { useLocation } from 'react-router-dom';
import { PortalLayout } from '@/components/PortalLayout';
import { Mail, MapPin, Phone, Award, BookOpen, Zap, Shield, Star } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

// Animated avatar orb
const AvatarOrb = () => {
  const orbRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      orbRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={orbRef}>
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            color="#c9a227"
            emissive="#ffd700"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </Sphere>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.3, 0.03, 16, 100]} />
          <meshStandardMaterial
            color="#14b8a6"
            emissive="#14b8a6"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.3, 0.03, 16, 100]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
};

const Profile = () => {
  const location = useLocation();
  const username = location.state?.username || 'Alchemist';

  const achievements = [
    { title: 'Grand Master', description: 'Completed 100 transmutations', icon: Award, color: 'text-amber-400' },
    { title: 'Knowledge Seeker', description: 'Read all ancient texts', icon: BookOpen, color: 'text-violet-400' },
    { title: 'Lightning Fast', description: 'Fastest reaction time', icon: Zap, color: 'text-teal-400' },
    { title: 'Guardian', description: 'Protected the sanctum', icon: Shield, color: 'text-emerald-400' },
  ];

  const stats = [
    { label: 'Projects Completed', value: '127' },
    { label: 'Total XP', value: '15,847' },
    { label: 'Rank', value: '#42' },
    { label: 'Streak Days', value: '89' },
  ];

  const skills = [
    { name: 'Transmutation', level: 95, color: 'bg-amber-400' },
    { name: 'Elemental Control', level: 88, color: 'bg-teal-400' },
    { name: 'Astral Navigation', level: 76, color: 'bg-violet-400' },
    { name: 'Essence Purification', level: 92, color: 'bg-emerald-400' },
    { name: 'Quantum Physics', level: 70, color: 'bg-blue-400' },
  ];

  return (
    <PortalLayout username={username}>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar 3D */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl">
              <div className="h-[300px] rounded-lg overflow-hidden mb-4">
                <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[5, 5, 5]} intensity={1} color="#ffd700" />
                    <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
                    <AvatarOrb />
                  </Suspense>
                </Canvas>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-amber-100 mb-2">{username}</h2>
                <p className="text-sm text-amber-200/60 mb-4">Master Alchemist</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <button className="w-full px-4 py-2 bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/40 text-amber-100 rounded-lg transition-all">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Info & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-amber-100 mb-4 tracking-wider">CONTACT INFORMATION</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-xs text-amber-200/50">Email</p>
                    <p className="text-sm text-amber-100">{username.toLowerCase()}@alchemist.portal</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-xs text-amber-200/50">Phone</p>
                    <p className="text-sm text-amber-100">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-xs text-amber-200/50">Location</p>
                    <p className="text-sm text-amber-100">Sanctum Prime, Tower 7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-amber-200/50">Member Since</p>
                    <p className="text-sm text-amber-100">January 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl text-center hover:scale-105 transition-all duration-300"
                >
                  <p className="text-2xl font-bold text-amber-100">{stat.value}</p>
                  <p className="text-xs text-amber-200/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-amber-100 mb-6 tracking-wider">ALCHEMICAL SKILLS</h3>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-amber-100 group-hover:text-amber-50 transition-colors">{skill.name}</span>
                  <span className="text-sm font-bold text-amber-400">{skill.level}%</span>
                </div>
                <div className="h-3 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${skill.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${skill.level}%`, animationDelay: `${index * 100}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-amber-100 mb-6 tracking-wider">ACHIEVEMENTS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-black/20 border border-amber-900/20 hover:border-amber-700/40 hover:scale-105 transition-all duration-300 cursor-pointer group"
                >
                  <Icon className={`w-8 h-8 ${achievement.color} mb-3`} />
                  <h4 className="text-sm font-bold text-amber-100 group-hover:text-amber-50 transition-colors mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-amber-200/50">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="p-6 rounded-xl bg-black/40 border border-amber-900/30 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-amber-100 mb-6 tracking-wider">RECENT ACTIVITY</h3>
          <div className="space-y-4">
            {[
              { action: 'Completed Quantum Transmutation project', time: '2 hours ago', color: 'border-emerald-700/30' },
              { action: 'Achieved Lightning Fast badge', time: '1 day ago', color: 'border-teal-700/30' },
              { action: 'Upgraded Elemental Control skill', time: '3 days ago', color: 'border-violet-700/30' },
              { action: 'Joined Philosopher\'s Council', time: '5 days ago', color: 'border-amber-700/30' },
            ].map((activity, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg bg-black/20 border ${activity.color} hover:bg-black/30 transition-all`}
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm text-amber-100">{activity.action}</p>
                  <p className="text-xs text-amber-200/40 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Profile;
