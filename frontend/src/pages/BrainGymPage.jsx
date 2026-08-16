import React, { useState } from 'react';
import { 
  Brain, Zap, Eye, Puzzle, Timer, Play, Lock, 
  BarChart3, ChevronRight, Trophy, X
} from 'lucide-react';
import { PatternRecognitionGame } from '../components/braingym/PatternRecognitionGame';

export const BrainGymPage = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { title: 'Spot the Pattern', category: 'Logic', time: '2 min', icon: Puzzle, color: 'text-rose-500', bg: 'bg-rose-100', locked: false },
    { title: 'Recall the Sequence', category: 'Memory', time: '3 min', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-100', locked: false },
    { title: 'Word Association', category: 'Verbal', time: '2 min', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100', locked: false },
    { title: 'Spatial Rotation', category: 'Focus', time: '4 min', icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-100', locked: true },
  ];

  const handlePlayClick = (game = null) => {
    setSelectedGame(game);
    
    // Launch actual game for the Daily Challenge or "Spot the Pattern"
    if (!game || game.title === 'Spot the Pattern') {
      setActiveGame('pattern');
    } else {
      setShowComingSoon(true);
    }
  };

  if (activeGame === 'pattern') {
    return <PatternRecognitionGame onExit={() => setActiveGame(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fade-in font-sans relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#29221D] tracking-tight font-serif mb-2">
            Brain Gym
          </h1>
          <p className="text-[#8A8178] font-medium">Daily cognitive workouts to keep your mind sharp.</p>
        </div>

        {/* Brain Stats */}
        <div className="flex items-center gap-6 bg-white border border-[#E5DEC9] rounded-2xl p-4 shadow-sm">
          <div>
            <p className="text-xs font-bold text-[#8A8178] uppercase tracking-wider mb-1">Brain Age</p>
            <p className="text-xl font-black text-[#4F7D52]">28</p>
          </div>
          <div className="w-px h-8 bg-[#E5DEC9]" />
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Top Skill</p>
            <p className="text-xl font-black theme-accent-text">Logic</p>
          </div>
        </div>
      </div>

      {/* Hero: Today's Workout */}
      <section className="theme-hero-bg rounded-[32px] p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-black rounded-full blur-3xl pointer-events-none opacity-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black rounded-full blur-3xl pointer-events-none opacity-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
              <Trophy className="w-3.5 h-3.5 theme-accent-text" />
              <span className="uppercase tracking-wider">Daily Challenge</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black theme-hero-text font-serif">Pattern Recognition Matrix</h2>
            <p className="text-slate-400 font-medium max-w-lg text-lg">Identify the missing shape in the sequence before the timer runs out. Improves fluid intelligence and logical reasoning.</p>
            
            <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
              <div className="flex items-center gap-2 theme-hero-text">
                <Timer className="w-5 h-5 opacity-70" />
                <span className="font-bold">2 Minutes</span>
              </div>
              <div className="flex items-center gap-2 theme-hero-text">
                <BarChart3 className="w-5 h-5 opacity-70" />
                <span className="font-bold">Hard</span>
              </div>
            </div>
          </div>

          <button onClick={() => handlePlayClick()} className="w-20 h-20 theme-accent-bg rounded-full flex items-center justify-center hover:scale-110 transition-all shrink-0">
            <Play className="w-8 h-8 text-white fill-current ml-1" />
          </button>
        </div>
      </section>

      {/* Game Library */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-[#29221D] font-serif border-b-2 border-[#E5DEC9] pb-2">Training Library</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game, idx) => (
            <div 
              key={idx} 
              onClick={() => !game.locked && handlePlayClick(game)}
              className={`relative flex items-center p-6 rounded-3xl border transition-all ${game.locked ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:theme-accent-border shadow-sm hover:shadow-md cursor-pointer group'}`}
            >
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mr-5 ${game.locked ? 'bg-slate-200 grayscale' : game.bg}`}>
                <game.icon className={`w-7 h-7 ${game.locked ? 'text-slate-400' : game.color}`} />
              </div>

              <div className={`flex-1 ${game.locked ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#8A8178]">{game.category}</span>
                  <span className="w-1 h-1 rounded-full bg-[#E5DEC9]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#8A8178]">{game.time}</span>
                </div>
                <h4 className="font-bold text-[#29221D] text-lg group-hover:text-[#7C350F] transition-colors">{game.title}</h4>
              </div>

              {game.locked ? (
                <div className="absolute top-4 right-4 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full border border-slate-200 group-hover:theme-accent-border group-hover:bg-slate-50 flex items-center justify-center transition-all">
                  <Play className="w-4 h-4 theme-accent-text fill-current ml-0.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center relative border border-[#E5DEC9]">
            <button 
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 theme-accent-text" />
            </div>
            <h3 className="text-2xl font-black text-[#29221D] font-serif mb-2">Coming Soon!</h3>
            <p className="text-[#8A8178] font-medium mb-8">
              {selectedGame ? `The "${selectedGame.title}" game` : "This Daily Challenge"} is currently under construction by our cognitive scientists. Check back later!
            </p>
            <button 
              onClick={() => setShowComingSoon(false)}
              className="w-full py-3 rounded-full bg-[#29221D] text-white font-bold hover:bg-[#1a1512] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
