import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { X, User, Check, Sparkles, Shield, Flame, Palette, GraduationCap, Rocket, BookOpen, Zap } from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || 'Learning 10 minutes every day with ReadWise AI');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '/mascot.png');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  // Illustrated Character Mascots (No Real Human Images)
  const characterAvatars = [
    { id: 'mascot', name: '3D Reporter Mascot', type: 'image', src: '/mascot.png' },
    { id: 'scholar', name: 'Scholar', type: 'icon', icon: GraduationCap, bg: 'bg-emerald-600' },
    { id: 'explorer', name: 'AI Explorer', type: 'icon', icon: Rocket, bg: 'bg-indigo-600' },
    { id: 'bookworm', name: 'Bookworm', type: 'icon', icon: BookOpen, bg: 'bg-amber-600' },
    { id: 'genius', name: 'Genius', type: 'icon', icon: Zap, bg: 'bg-teal-600' },
  ];

  const themeOptions = [
    { id: 'newspaper', name: 'Real Newspaper', color: 'bg-amber-800', border: 'border-amber-900' },
    { id: 'emerald', name: 'Emerald Mint', color: 'bg-emerald-500', border: 'border-emerald-600' },
    { id: 'indigo', name: 'Royal Indigo', color: 'bg-indigo-600', border: 'border-indigo-600' },
    { id: 'dark', name: 'Midnight Dark', color: 'bg-slate-900', border: 'border-slate-800' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ name, bio, avatarUrl });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      
      {/* Outer Shell */}
      <div className="relative w-full max-w-md bg-white border-2 theme-accent-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Fixed Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl btn-brand-gradient flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-poppins">Edit Profile & Theme</h2>
              <p className="text-xs font-bold text-slate-700">Customize avatar, colors, and preferences</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Inner Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <form onSubmit={handleSave} className="space-y-5">
            
            {/* Theme Preference Customizer */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-900 tracking-wider">
                <Palette className="w-4 h-4 theme-accent-text" />
                <span>Select Application Theme:</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {themeOptions.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`p-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 ${
                      theme === t.id
                        ? `${t.border} bg-slate-50 font-black shadow-sm`
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${t.color} shrink-0`} />
                    <span className="text-xs font-bold text-slate-900 truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Character Mascot Avatar Selector */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                Select Character Avatar:
              </label>

              <div className="flex items-center gap-3">
                {/* Active Avatar Preview */}
                <div className="relative w-14 h-14 rounded-full p-1 theme-accent-bg shadow-md shrink-0 flex items-center justify-center">
                  {avatarUrl?.startsWith('/') || avatarUrl?.startsWith('http') ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-contain rounded-full bg-white p-0.5"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full theme-accent-bg text-white flex items-center justify-center text-xl font-black">
                      {name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                {/* Character Mascots List */}
                <div className="flex items-center gap-2.5 overflow-x-auto p-1">
                  {characterAvatars.map((char) => {
                    const isSelected = avatarUrl === char.src;
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => setAvatarUrl(char.src)}
                        title={char.name}
                        className={`w-11 h-11 rounded-2xl border-2 transition-all shrink-0 flex items-center justify-center p-1 ${
                          isSelected ? 'theme-accent-border scale-110 shadow-md bg-white' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        }`}
                      >
                        {char.type === 'image' ? (
                          <img src={char.src} alt={char.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className={`w-full h-full rounded-xl ${char.bg} text-white flex items-center justify-center`}>
                            <char.icon className="w-5 h-5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-900">
                Display Name:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-sm font-bold text-slate-900 focus:theme-accent-border focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            </div>

            {/* Bio / Daily Goal */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-900">
                Daily Reading Goal / Bio:
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-slate-900 focus:theme-accent-border focus:outline-none transition-colors resize-none"
                placeholder="Your daily learning motto"
              />
            </div>

            {/* Account Badges */}
            <div className="p-3.5 rounded-2xl theme-accent-btn flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 theme-accent-text" />
                <span>Pro Scholar Account</span>
              </div>
              <div className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full text-[11px] font-black">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>1 Day Streak</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl border-2 border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl btn-brand-gradient text-white text-xs font-black shadow-md flex items-center gap-2"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
