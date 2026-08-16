import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, BookOpen, Lightbulb, Target, MessageSquare, 
  Briefcase, Wallet, Clock, ArrowRight, CheckCircle2, ChevronRight, Brain, RefreshCw
} from 'lucide-react';
import { SPARK_DATA, getDailySpark } from '../data/SparkData';

export const LearnPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedComplexity, setSelectedComplexity] = useState('simple');
  const [quizAnswer, setQuizAnswer] = useState(null);

  const targetSparkId = location.state?.sparkId;
  const [activeSpark, setActiveSpark] = useState(
    targetSparkId ? SPARK_DATA.find(s => s.id === targetSparkId) || getDailySpark() : getDailySpark()
  );

  const handleNextConcept = () => {
    let nextSpark;
    do {
      nextSpark = SPARK_DATA[Math.floor(Math.random() * SPARK_DATA.length)];
    } while (nextSpark.id === activeSpark.id && SPARK_DATA.length > 1);
    setActiveSpark(nextSpark);
    setSelectedComplexity('simple');
    setQuizAnswer(null);
  };

  const lifeSkills = [
    { title: 'How credit cards actually work', category: 'Money', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Write emails that get replies', category: 'Communication', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'The art of salary negotiation', category: 'Career', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Overcoming decision fatigue', category: 'Decision Making', icon: Brain, color: 'text-rose-600', bg: 'bg-rose-100' },
    { title: 'Time-boxing for extreme focus', category: 'Productivity', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  // Helper because Brain wasn't imported at top to save space in this chunk
  const BrainIcon = Sparkles; 

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fade-in font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-serif mb-2">
          Daily Learning
        </h1>
        <p className="opacity-70 font-medium">Master powerful mental models and practical life skills in 3 minutes.</p>
      </div>

      {/* 1. CONCEPT OF THE DAY */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 theme-accent-text" />
            <h2 className="text-xl font-bold font-serif uppercase tracking-widest">Concept of the Day</h2>
          </div>
          <button 
            onClick={handleNextConcept}
            className="text-xs font-bold px-4 py-2 rounded-full glass-panel border border-gray-500/20 hover:theme-accent-border hover:theme-accent-text flex items-center gap-2 transition-colors opacity-80 hover:opacity-100 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Next Concept
          </button>
        </div>

        <div className="glass-card rounded-[32px] shadow-sm overflow-hidden">
          {/* Concept Header */}
          <div className="theme-hero-bg p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-black rounded-full blur-3xl pointer-events-none opacity-20" />
            <h3 className="text-3xl sm:text-5xl font-black theme-hero-text font-serif mb-4 relative z-10">
              {activeSpark.title}
            </h3>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20 uppercase tracking-widest relative z-10">
              {activeSpark.category}
            </span>
          </div>

          {/* Interactive Toggle */}
          <div className="border-b border-gray-500/20 bg-gray-500/5 p-2 sm:p-4 flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setSelectedComplexity('simple')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedComplexity === 'simple' ? 'theme-accent-bg shadow-md' : 'bg-gray-500/10 opacity-70 border border-gray-500/20 hover:theme-accent-border hover:opacity-100'}`}
            >
              Explain Simply
            </button>
            <button 
              onClick={() => setSelectedComplexity('detail')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedComplexity === 'detail' ? 'theme-accent-bg shadow-md' : 'bg-gray-500/10 opacity-70 border border-gray-500/20 hover:theme-accent-border hover:opacity-100'}`}
            >
              Explain in Detail
            </button>
            <button 
              onClick={() => setSelectedComplexity('example')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedComplexity === 'example' ? 'theme-accent-bg shadow-md' : 'bg-gray-500/10 opacity-70 border border-gray-500/20 hover:theme-accent-border hover:opacity-100'}`}
            >
              Real-World Example
            </button>
          </div>

          {/* Content Body */}
          <div className="p-8 sm:p-10 space-y-8">
            {selectedComplexity === 'simple' && (
              <p className="text-lg leading-relaxed font-medium">
                {activeSpark.simple}
              </p>
            )}
            
            {selectedComplexity === 'detail' && (
              <p className="text-lg leading-relaxed font-medium">
                {activeSpark.detail}
              </p>
            )}

            {selectedComplexity === 'example' && (
              <p className="text-lg leading-relaxed font-medium">
                {activeSpark.example}
              </p>
            )}

            {/* Key Takeaway */}
            <div className="p-6 rounded-2xl bg-gray-500/10 border border-gray-500/20 flex gap-4 items-start">
              <Lightbulb className="w-6 h-6 theme-accent-text shrink-0 mt-1" />
              <div>
                <h4 className="font-black mb-1">Key Takeaway</h4>
                <p className="text-sm opacity-80 font-medium">{activeSpark.takeaway}</p>
              </div>
            </div>

            {/* Mini Question (Only show for sunk cost to preserve existing functionality) */}
            {activeSpark.id === 'sunk-cost' && (
              <div className="pt-6 border-t border-gray-500/20">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 theme-accent-text" />
                  Test your understanding
                </h4>
                <p className="text-sm font-medium mb-4">
                  You invested $5,000 in a stock that has now dropped to $1,000. You don't think it will recover, but you refuse to sell because you "don't want to lose $4,000." Is this the Sunk Cost Fallacy?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setQuizAnswer('correct')}
                    className={`px-6 py-2.5 rounded-xl border font-bold text-sm transition-all ${quizAnswer === 'correct' ? 'theme-accent-bg text-white theme-accent-border' : 'bg-gray-500/10 border-gray-500/20 hover:theme-accent-border'}`}
                  >
                    Yes, exactly.
                  </button>
                  <button 
                    onClick={() => setQuizAnswer('incorrect')}
                    className={`px-6 py-2.5 rounded-xl border font-bold text-sm transition-all ${quizAnswer === 'incorrect' ? 'bg-rose-500 text-white border-rose-500' : 'bg-gray-500/10 border-gray-500/20 hover:border-rose-500 hover:text-rose-500'}`}
                  >
                    No, that's just smart investing.
                  </button>
                </div>
                {quizAnswer === 'correct' && (
                  <p className="mt-4 text-sm font-bold theme-accent-text animate-fade-in flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Correct! You understand the concept.</p>
                )}
                {quizAnswer === 'incorrect' && (
                  <p className="mt-4 text-sm font-bold text-rose-500 animate-fade-in flex items-center gap-1">Incorrect! That's exactly what the sunk cost fallacy is.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. LIFE SKILLS */}
      <section className="space-y-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black font-serif mb-2">Life Skills Toolkit</h2>
            <p className="opacity-70 font-medium">Practical knowledge they didn't teach you in school.</p>
          </div>
          <button className="text-sm font-bold theme-accent-text hover:underline flex items-center gap-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lifeSkills.map((skill, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/learn/skill/${encodeURIComponent(skill.title)}`)}
              className="group cursor-pointer glass-panel p-5 rounded-2xl border border-gray-500/20 hover:theme-accent-border shadow-sm hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${skill.bg}`}>
                  <skill.icon className={`w-5 h-5 ${skill.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-0.5">{skill.category}</p>
                  <h4 className="font-bold text-sm group-hover:theme-accent-text transition-colors">{skill.title}</h4>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-40 group-hover:theme-accent-text transition-colors" />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
