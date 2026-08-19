import React, { useState } from 'react';
import { 
  Bot, 
  BarChart3, 
  Play, 
  BookOpen, 
  Sun, 
  Moon, 
  Sparkles, 
  Menu, 
  X,
  Code2
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'setup' | 'chat' | 'dashboard' | 'mcq' | 'result';
  onSelectTab: (tab: 'landing' | 'setup' | 'dashboard' | 'mcq') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  geminiActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  darkMode,
  onToggleDarkMode,
  geminiActive,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home', icon: Bot },
    { id: 'setup', label: 'Start Interview', icon: Play },
    { id: 'mcq', label: 'Practice MCQ', icon: BookOpen },
    { id: 'dashboard', label: 'Progress & Stats', icon: BarChart3 },
  ] as const;

  const handleNavClick = (tab: 'landing' | 'setup' | 'dashboard' | 'mcq') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
                InterviewPrep <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                Smart Chatbot
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden md:block">
              Prepare smarter. Interview better.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentTab === link.id || (currentTab === 'chat' && link.id === 'setup') || (currentTab === 'result' && link.id === 'setup');
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: AI status badge & Theme toggle & Mobile menu button */}
        <div className="flex items-center gap-2.5">
          {/* AI Status Badge */}
          <div 
            title={geminiActive ? 'Server-side Gemini 3.6 Flash Active' : 'Offline / Mock Evaluation Engine Active'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            <span className={`w-2 h-2 rounded-full ${geminiActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[11px]">{geminiActive ? 'Gemini 3.6 AI' : 'Smart Local AI'}</span>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 px-1">
            <span>Engine Status</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {geminiActive ? 'Gemini 3.6 Flash Active' : 'Smart Local AI Engine'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
