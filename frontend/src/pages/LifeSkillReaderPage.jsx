import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { 
  ArrowLeft, BookOpen, Lightbulb, Clock, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';

// Using a custom hook or simple axios call to fetch from our new backend endpoint
const fetchLifeSkill = async (topic) => {
  const response = await api.get(`/learn/skill/${encodeURIComponent(topic)}`);
  return response.data;
};

export const LifeSkillReaderPage = () => {
  const { topic } = useParams();
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: skillData, isLoading, error } = useQuery({
    queryKey: ['lifeSkill', topic],
    queryFn: () => fetchLifeSkill(topic),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F1E6] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-[#C96A2B]/30 border-t-[#C96A2B] rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-black text-[#29221D] font-serif">Curating Your Lesson...</h2>
        <p className="text-[#8A8178] mt-2 font-medium text-center">Consulting our AI knowledge base for {topic}</p>
      </div>
    );
  }

  if (error || !skillData) {
    return (
      <div className="min-h-screen bg-[#F7F1E6] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
          <Zap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#29221D] font-serif">Oops! Something went wrong.</h2>
        <p className="text-[#8A8178] mt-2 mb-6">Could not generate the lesson for {topic}.</p>
        <Link to="/learn" className="px-6 py-2 rounded-full bg-[#7C350F] text-white font-bold text-sm">
          Return to Learn
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F1E6] font-sans pb-24">
      {/* Editorial Header */}
      <header className="bg-white border-b border-[#E5DEC9] sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/learn" className="flex items-center gap-2 text-[#8A8178] hover:text-[#7C350F] transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#C96A2B]" />
            <span className="font-serif font-bold text-[#29221D] uppercase tracking-widest text-xs">Lumora Life Skills</span>
          </div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 space-y-12 animate-fade-in">
        
        {/* Title Area */}
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#C96A2B] text-xs font-black uppercase tracking-widest mx-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>3 Min Read</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-[#29221D] font-serif leading-tight">
            {skillData.title}
          </h1>
          <div className="w-24 h-1 bg-[#C96A2B] mx-auto rounded-full" />
        </div>

        {/* Summary (The Drop Cap approach) */}
        <div className="relative p-8 sm:p-10 bg-white rounded-3xl border border-[#E5DEC9] shadow-sm">
          <p className="text-xl text-[#29221D] leading-relaxed font-medium">
            <span className="float-left text-6xl font-black font-serif text-[#7C350F] pr-3 pt-2 leading-[0.8]">
              {skillData.summary.charAt(0)}
            </span>
            {skillData.summary.substring(1)}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 px-2">
          {skillData.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-2xl font-bold text-[#29221D] font-serif flex items-center gap-3">
                <span className="text-[#C96A2B] text-lg font-black">{idx + 1}.</span>
                {section.heading}
              </h2>
              <p className="text-lg text-[#5c554e] leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Actionable Advice */}
        <div className="mt-16 bg-[#29221D] text-[#F7F1E6] p-8 sm:p-12 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C350F]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-8 h-8 text-[#C96A2B]" />
              <h3 className="text-2xl font-black font-serif uppercase tracking-widest text-white/90">Actionable Advice</h3>
            </div>
            <p className="text-xl leading-relaxed font-medium">
              {skillData.actionableAdvice}
            </p>
            <button 
              onClick={() => setIsCompleted(true)}
              className={`mt-4 flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isCompleted ? 'bg-[#4F7D52] text-white shadow-lg scale-105' : 'bg-[#C96A2B] hover:bg-[#a85521] text-white'}`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isCompleted ? 'Completed! +10 XP' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default LifeSkillReaderPage;
