import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, FolderKanban, User, FlaskConical, Settings, LogOut, Menu, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface PortalLayoutProps {
  children: React.ReactNode;
  username: string;
}

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Transmutation Lab', path: '/lab', icon: FlaskConical },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const PortalLayout = ({ children, username }: PortalLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useTheme();

  const handleLogout = () => {
    navigate('/', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: theme === 'dark' ? '#0a0510' : '#f5f5f0' }}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full backdrop-blur-xl border-r z-50 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-black/80 to-black/60 border-amber-900/30' 
            : 'bg-gradient-to-b from-white/90 to-gray-100/80 border-amber-600/20'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-amber-900/30' : 'border-amber-600/20'
        }`}>
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex-1">
                <h2 className={`font-bold tracking-[0.2em] text-sm ${
                  theme === 'dark' ? 'text-amber-100' : 'text-amber-900'
                }`}>ALCHEMIST PORTAL</h2>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-amber-200/40' : 'text-amber-700/60'
                }`}>{username}</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-amber-900/20' : 'hover:bg-amber-100/40'
              }`}
            >
              {sidebarOpen ? (
                <X className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-amber-200/60' : 'text-amber-800/70'
                }`} />
              ) : (
                <Menu className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-amber-200/60' : 'text-amber-800/70'
                }`} />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path, { state: { username } })}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  active
                    ? theme === 'dark'
                      ? 'bg-amber-900/40 text-amber-100 shadow-lg shadow-amber-900/20'
                      : 'bg-amber-200/60 text-amber-900 shadow-lg shadow-amber-400/30'
                    : theme === 'dark'
                      ? 'text-amber-200/60 hover:bg-amber-900/20 hover:text-amber-100'
                      : 'text-amber-700/70 hover:bg-amber-100/40 hover:text-amber-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  active 
                    ? theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
                    : theme === 'dark' ? 'group-hover:text-amber-300' : 'group-hover:text-amber-700'
                }`} />
                {sidebarOpen && (
                  <span className="text-sm font-medium tracking-wide">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          theme === 'dark' ? 'border-amber-900/30' : 'border-amber-600/20'
        }`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              theme === 'dark'
                ? 'text-red-300/60 hover:bg-red-900/20 hover:text-red-200'
                : 'text-red-600/70 hover:bg-red-100/40 hover:text-red-700'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-black/40 border-amber-900/30'
            : 'bg-white/60 border-amber-600/20'
        }`}>
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-bold tracking-[0.15em] ${
                theme === 'dark' ? 'text-amber-100' : 'text-amber-900'
              }`}>
                {navigationItems.find((item) => item.path === location.pathname)?.name || 'PORTAL'}
              </h1>
              <p className={`text-xs mt-1 tracking-wider ${
                theme === 'dark' ? 'text-amber-200/40' : 'text-amber-700/60'
              }`}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-teal-900/20 border-teal-700/30'
                  : 'bg-teal-100/40 border-teal-600/30'
              }`}>
                <span className={`text-xs tracking-wider ${
                  theme === 'dark' ? 'text-teal-200/70' : 'text-teal-700'
                }`}>⬡ ACTIVE</span>
              </div>
              <div className={`px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-violet-900/20 border-violet-700/30'
                  : 'bg-violet-100/40 border-violet-600/30'
              }`}>
                <span className={`text-xs tracking-wider ${
                  theme === 'dark' ? 'text-violet-200/70' : 'text-violet-700'
                }`}>⬡ SECURE</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
