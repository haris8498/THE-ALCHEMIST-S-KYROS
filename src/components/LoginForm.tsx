import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

interface LoginFormProps {
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFieldFocus: (field: 'none' | 'username' | 'password') => void;
  onPasswordRevealChange: (revealed: boolean) => void;
  onLogin: (username: string, password: string) => void;
  isAssembled: boolean;
}

export const LoginForm = ({
  onUsernameChange,
  onPasswordChange,
  onFieldFocus,
  onPasswordRevealChange,
  onLogin,
  isAssembled
}: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    onUsernameChange(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    onPasswordChange(value);
  };

  const togglePasswordVisibility = () => {
    const newState = !showPassword;
    setShowPassword(newState);
    onPasswordRevealChange(newState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setIsLoading(true);
    
    // Simulate login delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onLogin(username, password);
  };

  return (
    <div 
      className={`
        absolute inset-0 z-10 flex items-center justify-center
        transition-opacity duration-1000
        ${isAssembled ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-4 p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
      >
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          ACCESS TERMINAL
        </h1>
        <p className="text-center text-cyan-400/60 text-sm mb-8">
          Authenticate to proceed
        </p>
        
        {/* Username field */}
        <div className="relative mb-6">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400/50" />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            onFocus={() => onFieldFocus('username')}
            onBlur={() => onFieldFocus('none')}
            className="pl-11 h-12 bg-black/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all"
          />
        </div>
        
        {/* Password field */}
        <div className="relative mb-8">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400/50" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => onFieldFocus('password')}
            onBlur={() => onFieldFocus('none')}
            className="pl-11 pr-11 h-12 bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400/30 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-400 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {/* Submit button */}
        <Button
          type="submit"
          disabled={!username || !password || isLoading}
          className="w-full h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              AUTHENTICATING...
            </span>
          ) : (
            'INITIALIZE CONNECTION'
          )}
        </Button>
        
        <p className="text-center text-cyan-400/40 text-xs mt-6">
          Demo Mode: Any credentials accepted
        </p>
      </form>
    </div>
  );
};
