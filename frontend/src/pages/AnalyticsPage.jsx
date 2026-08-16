import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { habitService } from '../services/habitService';
import { 
  Flame, BarChart3, BookOpen, Brain, Trophy, Calendar, Sparkles, 
  TrendingUp, Clock, Info 
} from 'lucide-react';

export const AnalyticsPage = () => {
  const { data: statsRes } = useQuery({
    queryKey: ['habitDashboard'],
    queryFn: async () => {
      const res = await habitService.getDashboardStats();
      return res.data;
    },
  });

  const { data: streakRes } = useQuery({
    queryKey: ['userStreak'],
    queryFn: async () => {
      const res = await habitService.getStreak();
      return res.data;
    },
  });

  // Real Streak Value from Backend (allows 0 if streak broken)
  const currentStreakValue = streakRes?.currentStreak ?? statsRes?.currentStreak ?? 0;
  const longestStreakValue = streakRes?.longestStreak ?? statsRes?.longestStreak ?? 0;

  const stats = {
    currentStreak: currentStreakValue,
    longestStreak: longestStreakValue,
    totalArticlesRead: statsRes?.totalArticlesRead ?? 0,
    totalVocabularySaved: statsRes?.totalVocabularySaved ?? 0,
    totalQuizzesTaken: statsRes?.totalQuizzesTaken ?? 0,
    quizPassRatePercentage: statsRes?.quizPassRatePercentage ?? 0,
  };

  // Dynamic Date & Heatmap Generator
  const today = new Date();
  const todayDate = today.getDate();
  const currentYear = today.getFullYear();
  const currentMonthIdx = today.getMonth();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Create current month object
  const daysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonthIdx, 1).getDay();
  
  const months = [
    { name: `${monthNames[currentMonthIdx]} ${currentYear}`, days: daysInMonth, startDay: startDay, isCurrentMonth: true },
  ];

  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);

  // Helper to get real intensity from backend stats
  const getDayIntensity = (dayNum) => {
    if (!statsRes?.heatmap) return 0;
    const targetDate = new Date(currentYear, currentMonthIdx, dayNum);
    // Format to YYYY-MM-DD for matching
    const tzOffset = targetDate.getTimezoneOffset() * 60000;
    const dateString = new Date(targetDate - tzOffset).toISOString().split('T')[0];
    
    const activity = statsRes.heatmap.find(d => d.date === dateString);
    return activity ? activity.intensity : 0;
  };

  const getActivityColor = (dayNum, isToday) => {
    const intensity = getDayIntensity(dayNum);

    if (isToday) {
      return 'bg-slate-900 border-2 theme-accent-border text-white font-black shadow-md';
    }

    if (intensity >= 3) return 'bg-emerald-700 border-emerald-700 text-white font-bold shadow-sm';
    if (intensity === 2) return 'theme-accent-bg border-transparent text-white font-bold shadow-sm';
    if (intensity === 1) return 'bg-gray-500/20 border-gray-500/30 font-bold shadow-sm';
    return 'bg-gray-500/5 border-gray-500/20 opacity-60 font-medium'; // Empty
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <div className="border-b-2 border-gray-500/20 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-serif mb-2">
            Reading Analytics
          </h1>
          <BarChart3 className="w-6 h-6 theme-accent-text mb-2" />
        </div>
        <p className="opacity-70 font-medium">
          Track your daily 10-minute reading streak, vocabulary growth, and AI quiz performance.
        </p>
      </div>

      {/* Hero Colorful Streak Panel */}
      <div className="p-8 rounded-3xl theme-hero-bg shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-black/30 flex items-center justify-center shadow-lg shrink-0">
            <Flame className="w-10 h-10 text-white fill-current animate-bounce" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-4xl sm:text-5xl font-black font-serif text-white">
                {stats.currentStreak} Day Streak
              </h2>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-black shadow-sm border uppercase tracking-wider bg-white/10 text-white border-white/20 w-fit">
                🔥 TODAY'S STREAK ACTIVE
              </span>
            </div>
            <p className="text-sm font-medium text-slate-300">
              Personal Best: <strong>{stats.longestStreak} Days</strong> • Completed today's reading session to protect your streak!
            </p>
          </div>
        </div>

        {/* Target Habit Pill */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8 shrink-0 relative z-10 w-full md:w-auto">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1">Daily Goal</p>
            <p className="text-2xl font-black text-white font-serif">
              10 Mins / Day
            </p>
          </div>
        </div>
      </div>

      {/* Month-Wise Activity Heatmap Calendar */}
      <div className="p-8 rounded-3xl glass-card shadow-sm space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 theme-accent-text" />
            <h3 className="text-xl font-black font-serif">
              Month-Wise Reading Activity
            </h3>
          </div>

          {/* Month Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {months.map((m, idx) => (
              <button
                key={m.name}
                onClick={() => setSelectedMonthIdx(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedMonthIdx === idx
                    ? 'theme-accent-bg shadow-md'
                    : 'bg-gray-500/5 opacity-70 border border-gray-500/20 hover:theme-accent-border hover:opacity-100'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation Banner for "Less ... More" Activity Heatmap */}
        <div className="p-4 rounded-2xl bg-gray-500/5 border border-gray-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-bold gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 theme-accent-text shrink-0" />
            <span className="font-medium">
              <strong className="theme-accent-text">Heatmap Guide:</strong> Square colors indicate reading intensity. Light = low activity, Dark = high activity.
            </span>
          </div>

          {/* Theme-Aware Less...More Legend */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-bold opacity-60">Less</span>
            <div className="w-4 h-4 rounded bg-gray-500/5 border border-gray-500/20" title="No activity" />
            <div className="w-4 h-4 rounded bg-gray-500/20" title="1 article read" />
            <div className="w-4 h-4 rounded theme-accent-bg" title="2 articles read" />
            <div className="w-4 h-4 rounded bg-emerald-700" title="Completed quiz + 10 mins reading" />
            <span className="font-bold opacity-60">More</span>
          </div>
        </div>

        {/* Days Calendar Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-500/20 pb-2">
            <h4 className="text-sm font-black uppercase tracking-wider">{months[selectedMonthIdx].name}</h4>
          </div>

          <div className="grid grid-cols-7 gap-3 pt-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
              <div key={dayName} className="text-center text-xs font-black uppercase py-1 opacity-60">
                {dayName}
              </div>
            ))}

            {/* Blank leading slots */}
            {Array.from({ length: months[selectedMonthIdx].startDay }).map((_, i) => (
              <div key={`blank-${i}`} className="h-14 rounded-2xl bg-gray-500/5 border border-gray-500/10" />
            ))}

            {/* Day Boxes */}
            {Array.from({ length: months[selectedMonthIdx].days }).map((_, i) => {
              const dayNum = i + 1;
              const isToday = months[selectedMonthIdx].isCurrentMonth && dayNum === todayDate;

              return (
                <div
                  key={dayNum}
                  className={`h-14 rounded-2xl border flex flex-col items-center justify-center p-1 transition-all relative hover:scale-105 cursor-default ${getActivityColor(
                    dayNum,
                    isToday
                  )}`}
                  title={isToday ? "🔥 TODAY (Active Streak Day!)" : `Day ${dayNum} of ${months[selectedMonthIdx].name}`}
                >
                  <span className="text-sm font-black">{dayNum}</span>
                  
                  {/* Glowing Today Flame Marker */}
                  {isToday && (
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-white text-[9px] font-black shadow-md border border-white flex items-center gap-0.5 animate-bounce theme-accent-bg">
                      <Flame className="w-2.5 h-2.5 fill-current" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl glass-card shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-500/10 theme-accent-text">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-wider opacity-60">Articles Read</p>
          <p className="text-4xl font-black font-serif">{stats.totalArticlesRead}</p>
        </div>

        <div className="p-6 rounded-3xl glass-card shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-500/10 theme-accent-text">
            <Brain className="w-6 h-6" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-wider opacity-60">Vocabulary Saved</p>
          <p className="text-4xl font-black font-serif">{stats.totalVocabularySaved}</p>
        </div>

        <div className="p-6 rounded-3xl glass-card shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-500/10 theme-accent-text">
            <Trophy className="w-6 h-6" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-wider opacity-60">Quizzes Completed</p>
          <p className="text-4xl font-black font-serif">{stats.totalQuizzesTaken}</p>
        </div>

        <div className="p-6 rounded-3xl glass-card shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-wider opacity-60">Quiz Accuracy</p>
          <p className="text-4xl font-black font-serif text-emerald-500">
            {stats.quizPassRatePercentage}%
          </p>
        </div>

      </div>

    </div>
  );
};
