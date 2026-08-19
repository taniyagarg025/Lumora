import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { habitService } from '../../services/habitService';
import { ProfileModal } from './ProfileModal';
import { 
  BookOpen, Sparkles, Brain, Bookmark, BarChart3, LogOut, Flame, 
  Sun, Moon, Newspaper, Palette, Menu, X
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamically fetch current user streak from backend API
  const { data: streakRes } = useQuery({
    queryKey: ['userStreak'],
    queryFn: async () => {
      const res = await habitService.getStreak();
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const currentStreak = Math.max(1, streakRes?.currentStreak ?? 1);

  const navItems = [
    { label: 'Home', path: '/home', icon: Sparkles },
    { label: 'Feed', path: '/feed', icon: Newspaper },
    { label: 'Learn', path: '/learn', icon: BookOpen },
    { label: 'Vocabulary', path: '/vocabulary', icon: Bookmark },
    { label: 'Quiz', path: '/quizzes', icon: Flame },
  ];

  const secondaryNavItems = [
    { label: 'Notes', path: '/notes', icon: Bookmark },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-2.5 px-3 sm:px-6 border-b shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Section: Hamburger + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Hamburger Button */}
            {isAuthenticated && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </button>
            )}

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 rounded-xl btn-brand-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg tracking-tight font-poppins flex items-center gap-1">
                Lumora <span className="gradient-brand-text font-black">AI</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links for Authenticated Users */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-full border shadow-xs relative">
              {navItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path === '/home' && location.pathname === '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'btn-brand-gradient active-nav-pill text-white shadow-sm'
                        : 'opacity-85 hover:opacity-100 hover:bg-black/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* More Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-150 opacity-85 hover:opacity-100 hover:bg-black/5">
                  <span>More</span>
                  <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-48 glass-panel rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <div className="p-2 space-y-1">
                    {[...navItems.slice(4), ...secondaryNavItems].map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 ${
                            isActive
                              ? 'theme-accent-bg'
                              : 'hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${!isActive ? 'opacity-60' : ''}`} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 shrink-0">
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-2.5">
                
                {/* Theme Selector */}
                <div className="hidden md:flex items-center gap-0.5 p-0.5 rounded-full border">
                  <button
                    onClick={() => setTheme('newspaper')}
                    className={`p-1.5 rounded-full text-xs transition-all ${
                      theme === 'newspaper' ? 'bg-amber-800 text-amber-50 font-black shadow-xs border border-amber-900' : 'opacity-60 hover:opacity-100'
                    }`}
                    title="Real Newspaper Editorial Mode"
                  >
                    <Newspaper className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setTheme('emerald')}
                    className={`p-1.5 rounded-full text-xs transition-all ${
                      theme === 'emerald' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'opacity-60 hover:opacity-100'
                    }`}
                    title="Emerald Mint Theme"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setTheme('indigo')}
                    className={`p-1.5 rounded-full text-xs transition-all ${
                      theme === 'indigo' ? 'bg-indigo-600 text-white font-black shadow-xs' : 'opacity-60 hover:opacity-100'
                    }`}
                    title="Royal Indigo Theme"
                  >
                    <Palette className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-1.5 rounded-full text-xs transition-all ${
                      theme === 'dark' ? 'bg-slate-800 text-purple-300 font-black shadow-xs' : 'opacity-60 hover:opacity-100'
                    }`}
                    title="Midnight Dark Mode"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Daily Streak Indicator */}
                <div 
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full theme-accent-btn border text-xs font-black shadow-xs"
                  title="Active Learning Streak"
                >
                  <Flame className="w-4 h-4 theme-accent-text animate-bounce" />
                  <span className="text-xs font-black tracking-tight"><strong className="text-sm font-black mr-0.5">{currentStreak}</strong> Day Streak</span>
                </div>

                {/* Clickable Profile Avatar & Badge */}
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="user-profile-badge flex items-center gap-2 p-1 px-2 rounded-full hover:opacity-90 transition-all border theme-accent-border shadow-xs group"
                  title="Click to view & edit Profile & Themes"
                >
                  <div className="user-profile-avatar w-7 h-7 rounded-full btn-brand-gradient text-white flex items-center justify-center text-xs font-black shadow-xs overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    {user?.avatarUrl?.startsWith('/') || user?.avatarUrl?.startsWith('http') ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-contain bg-white" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="text-xs font-black hidden lg:inline pr-1">
                    {user?.name}
                  </span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full theme-accent-btn theme-accent-text hover:opacity-80 border theme-accent-border text-xs font-black transition-all shrink-0 shadow-xs"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Logout</span>
                </button>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1 text-xs font-black hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1 text-xs font-black text-white btn-brand-gradient rounded-full"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b shadow-xl z-40 overflow-y-auto max-h-[calc(100vh-4rem)] animate-fade-in pb-4">
          <div className="p-4 space-y-4">
            
            {/* Primary Nav Items */}
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-3">Main Navigation</p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'theme-accent-text' : 'opacity-60'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Secondary Nav Items */}
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-3">Tools</p>
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'theme-accent-text' : 'opacity-60'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Theme Selector for Mobile */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-3">Theme</p>
              <div className="flex items-center gap-2 px-3">
                <button onClick={() => { setTheme('newspaper'); setIsMobileMenuOpen(false); }} className={`p-2 rounded-full ${theme === 'newspaper' ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-500'}`}><Newspaper className="w-4 h-4" /></button>
                <button onClick={() => { setTheme('emerald'); setIsMobileMenuOpen(false); }} className={`p-2 rounded-full ${theme === 'emerald' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}><Sun className="w-4 h-4" /></button>
                <button onClick={() => { setTheme('indigo'); setIsMobileMenuOpen(false); }} className={`p-2 rounded-full ${theme === 'indigo' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}><Palette className="w-4 h-4" /></button>
                <button onClick={() => { setTheme('dark'); setIsMobileMenuOpen(false); }} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-purple-300' : 'bg-slate-100 text-slate-500'}`}><Moon className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />
            
            {/* Logout Mobile */}
            <button
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
            
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};
