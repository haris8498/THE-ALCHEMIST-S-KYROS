import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface LoginFormProps {
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFieldFocus: (field: 'none' | 'username' | 'password') => void;
  onPasswordRevealChange: (revealed: boolean) => void;
  onLogin: (username: string, password: string) => void;
  onError: () => void;
  isAssembled: boolean;
}

// Runic font mapping for display
const toRunes = (text: string): string => {
  const runeMap: { [key: string]: string } = {
    'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ',
    'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ',
    'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ',
    's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚹ', 'w': 'ᚹ', 'x': 'ᛉ',
    'y': 'ᛇ', 'z': 'ᛉ'
  };
  return text.toLowerCase().split('').map(c => runeMap[c] || c).join('');
};

export const AlchemistLoginForm = ({
  onUsernameChange,
  onPasswordChange,
  onFieldFocus,
  onPasswordRevealChange,
  onLogin,
  onError,
  isAssembled
}: LoginFormProps) => {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'none' | 'username' | 'password'>('none');

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

  const handleFieldFocus = (field: 'username' | 'password') => {
    setFocusedField(field);
    onFieldFocus(field);
  };

  const handleFieldBlur = () => {
    setFocusedField('none');
    onFieldFocus('none');
  };

  const togglePasswordVisibility = () => {
    const newState = !showPassword;
    setShowPassword(newState);
    onPasswordRevealChange(newState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      onError();
      return;
    }
    
    setIsLoading(true);
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onLogin(username, password);
  };

  return (
    <div 
      className={`
        absolute inset-0 z-10 flex items-center justify-center
        transition-all duration-1000
        ${isAssembled ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <form 
        onSubmit={handleSubmit}
        className={`w-full max-w-md mx-4 p-10 rounded-2xl backdrop-blur-2xl border shadow-2xl transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-black/60 to-black/40 border-amber-900/30 shadow-amber-900/10'
            : 'bg-gradient-to-b from-white/70 to-gray-100/60 border-amber-600/30 shadow-amber-600/20'
        }`}
      >
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className={`text-2xl font-light tracking-[0.3em] mb-2 ${
            theme === 'dark' ? 'text-amber-100/90' : 'text-amber-900/90'
          }`}>
            THE ALCHEMIST&apos;S
          </h1>
          <h2 className={`text-4xl font-bold tracking-wider ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200'
              : 'bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700'
          } bg-clip-text text-transparent`}>
            KYROS
          </h2>
          <div className={`mt-4 h-px bg-gradient-to-r from-transparent to-transparent ${
            theme === 'dark' ? 'via-amber-600/50' : 'via-amber-700/60'
          }`} />
        </div>
        
        {/* Username field */}
        <div className="relative mb-6 group">
          <label className="block text-xs tracking-[0.2em] text-teal-400/70 mb-2 uppercase">
            Identity Cipher
          </label>
          <Input
            type="text"
            placeholder="Enter your name..."
            value={username}
            onChange={handleUsernameChange}
            onFocus={() => handleFieldFocus('username')}
            onBlur={handleFieldBlur}
            className="h-14 bg-black/40 border-amber-900/40 text-amber-100 placeholder:text-amber-100/20 focus:border-teal-500/60 focus:ring-teal-500/20 transition-all text-lg tracking-wide"
          />
          {/* Runic display */}
          {username && focusedField === 'username' && (
            <div className="absolute -bottom-6 left-0 right-0 text-center text-teal-400/60 text-sm tracking-[0.5em] font-mono">
              {toRunes(username)}
            </div>
          )}
        </div>
        
        {/* Password field */}
        <div className="relative mb-10 mt-10 group">
          <label className="block text-xs tracking-[0.2em] text-violet-400/70 mb-2 uppercase">
            Secret Incantation
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Speak the words..."
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => handleFieldFocus('password')}
              onBlur={handleFieldBlur}
              className="h-14 pr-12 bg-black/40 border-amber-900/40 text-violet-100 placeholder:text-violet-100/20 focus:border-violet-500/60 focus:ring-violet-500/20 transition-all text-lg tracking-wide"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/40 hover:text-amber-400 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {/* Show password hint */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="mt-3 text-xs tracking-[0.15em] text-amber-600/60 hover:text-amber-400 transition-colors uppercase"
          >
            {showPassword ? '⬡ SEAL THE LIGHT' : '⬡ REVEAL THE CORE'}
          </button>
        </div>
        
        {/* Submit button */}
        <Button
          type="submit"
          disabled={!username || !password || isLoading}
          className="w-full h-14 bg-gradient-to-r from-amber-900/80 via-amber-800/80 to-amber-900/80 hover:from-amber-800 hover:via-amber-700 hover:to-amber-800 text-amber-100 font-semibold tracking-[0.2em] transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-amber-700/30 text-base"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="h-5 w-5 border-2 border-amber-100/30 border-t-amber-100 rounded-full animate-spin" />
              TRANSMUTING...
            </span>
          ) : (
            'INITIATE TRANSFORMATION'
          )}
        </Button>
        
        <p className="text-center text-amber-100/30 text-xs mt-8 tracking-wider">
          Demo Mode — Any credentials accepted
        </p>
      </form>
    </div>
  );
};
