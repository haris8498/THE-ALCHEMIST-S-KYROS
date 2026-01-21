import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlchemistScene } from '@/components/3d/AlchemistScene';
import { AlchemistLoginForm } from '@/components/AlchemistLoginForm';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeField, setActiveField] = useState<'none' | 'username' | 'password'>('none');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  const [isAssembled, setIsAssembled] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleAssemblyComplete = useCallback(() => {
    setIsAssembled(true);
  }, []);

  const handleLogin = useCallback((user: string, _pass: string) => {
    // Navigate to dashboard with username in state
    navigate('/dashboard', { state: { username: user } });
  }, [navigate]);

  const handleError = useCallback(() => {
    setHasError(true);
    setTimeout(() => setHasError(false), 500);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden transition-colors duration-300" style={{ background: theme === 'dark' ? '#0a0510' : '#f5f5f0' }}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 z-30 p-3 rounded-lg backdrop-blur-xl border transition-all hover:scale-110 ${ 
          theme === 'dark'
            ? 'bg-amber-900/20 border-amber-700/40 text-amber-200 hover:bg-amber-900/40'
            : 'bg-amber-100/40 border-amber-600/40 text-amber-800 hover:bg-amber-200/60'
        }`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      
      {/* 3D Alchemist Scene */}
      <AlchemistScene
        activeField={activeField}
        username={username}
        password={password}
        isPasswordRevealed={isPasswordRevealed}
        isAssembled={isAssembled}
        hasError={hasError}
        onAssemblyComplete={handleAssemblyComplete}
      />
      
      {/* Login Form Overlay */}
      <AlchemistLoginForm
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onFieldFocus={setActiveField}
        onPasswordRevealChange={setIsPasswordRevealed}
        onLogin={handleLogin}
        onError={handleError}
        isAssembled={isAssembled}
      />
      
      {/* Loading state during assembly */}
      {!isAssembled && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-2 border-amber-600/30 rounded-full animate-ping" />
              <div className="absolute inset-2 border-2 border-teal-500/40 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-4 border-2 border-violet-500/40 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
              <div className="absolute inset-6 bg-amber-500/20 rounded-full animate-pulse" />
            </div>
            <p className="text-amber-100/50 text-sm tracking-[0.3em] uppercase">
              Awakening the Kyros...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
