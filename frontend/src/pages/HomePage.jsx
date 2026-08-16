import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Flame, BookOpen, Brain, Sparkles, CheckCircle2, ChevronRight, 
  Newspaper, Layers, Target, Clock, ArrowRight, Zap
} from 'lucide-react';
import { habitService } from '../services/habitService';

export const HomePage = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0 });

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await habitService.getStreak();
        setStreakData(res.data);
      } catch (err) {
        console.error("Failed to fetch streak", err);
      }
    };
    fetchStreak();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const DAILY_CONCEPTS = [
    "What is the \"Sunk Cost Fallacy\" and how does it ruin your decisions?",
    "The \"Dunning-Kruger Effect\": Why incompetent people think they're amazing.",
    "What is \"Occam's Razor\" and why is the simplest explanation often the best?",
    "Understanding the \"Pareto Principle\" (80/20 Rule) for maximum productivity.",
    "The \"Butterfly Effect\": How small actions create massive consequences.",
    "What is \"Confirmation Bias\" and how it shapes your worldview.",
    "The \"Halo Effect\": Why first impressions matter more than you think."
  ];

  const conceptOfTheDay = DAILY_CONCEPTS[new Date().getDay() % DAILY_CONCEPTS.length];

  const journeySteps = [
    { id: 'know', title: 'KNOW', desc: "Today's important news", time: '5 min', icon: Newspaper, color: 'text-indigo-600', bg: 'bg-indigo-50', completed: true, link: '/feed' },
    { id: 'learn', title: 'LEARN', desc: 'Concept of the day', time: '3 min', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50', completed: false, link: '/learn' },
    { id: 'word', title: 'WORD', desc: 'Vocabulary of the day', time: '2 min', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50', completed: false, link: '/vocabulary' },
    { id: 'practice', title: 'PRACTICE', desc: 'Quiz / mini challenge', time: '3 min', icon: Target, color: 'text-rose-600', bg: 'bg-rose-50', completed: false, link: '/quizzes' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in font-sans">
      
      {/* Header section */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-serif">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Learner'} 👋
          </h1>
          <p className="opacity-70 mt-2 font-medium">Here is your 15-minute learning plan for today.</p>
        </div>
        
        {/* Quick Stats Pill */}
        <div className="flex glass-panel rounded-2xl p-1 shadow-sm shrink-0">
          <div className="flex items-center gap-1.5 px-4 py-2 border-r border-gray-500/20">
            <Flame className="w-4 h-4 theme-accent-text fill-current" />
            <span className="font-bold text-sm">{streakData.currentStreak || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 border-r border-gray-500/20">
            <Clock className="w-4 h-4 opacity-70" />
            <span className="font-bold text-sm">5m</span>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2">
            <Brain className="w-4 h-4 opacity-70" />
            <span className="font-bold text-sm">12</span>
          </div>
        </div>
      </section>

      {/* Hero Continue Card */}
      <section>
        <Link to="/learn" className="block relative overflow-hidden theme-hero-bg rounded-3xl p-6 sm:p-8 shadow-xl group hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/20 transition-colors duration-700" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
                <Zap className="w-3.5 h-3.5 fill-current text-white" />
                <span className="uppercase tracking-wider">Up Next: Learn</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">Concept of the Day</h2>
              <p className="text-slate-300 font-medium max-w-sm">{conceptOfTheDay}</p>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </section>

      {/* Progress & Journey Section */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Progress Bar Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Today's Progress</h3>
            <span className="text-sm font-bold opacity-70">20% (1/5)</span>
          </div>
          <div className="h-3 w-full bg-gray-500/20 rounded-full overflow-hidden border border-gray-500/20">
            <div className="h-full theme-accent-bg w-1/5 rounded-full transition-all duration-1000 ease-out" />
          </div>
        </div>

        {/* The Daily Knowledge Journey List */}
        <div className="space-y-3">
          {journeySteps.map((step, idx) => (
            <Link 
              key={step.id} 
              to={step.link}
              className={`flex items-center p-4 rounded-2xl transition-all border ${
                step.completed 
                  ? 'bg-gray-500/10 border-gray-500/20' 
                  : 'glass-panel hover:theme-accent-border hover:shadow-md'
              }`}
            >
              
              {/* Status / Checkmark */}
              <div className="shrink-0 mr-4">
                {step.completed ? (
                  <CheckCircle2 className="w-6 h-6 theme-accent-text" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-500/30 flex items-center justify-center" />
                )}
              </div>

              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-4 ${step.completed ? 'bg-gray-500/20 grayscale' : step.bg}`}>
                <step.icon className={`w-5 h-5 ${step.completed ? 'opacity-50' : step.color}`} />
              </div>

              {/* Text */}
              <div className={`flex-1 ${step.completed ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm tracking-widest uppercase">{step.title}</h4>
                  <span className="text-xs font-bold opacity-80 px-2 py-0.5 rounded-md bg-gray-500/10 border border-gray-500/20">{step.time}</span>
                </div>
                <p className="text-sm opacity-70 font-medium mt-0.5">{step.desc}</p>
              </div>

              {/* Chevron */}
              {!step.completed && (
                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </Link>
          ))}
        </div>

      </section>

    </div>
  );
};
