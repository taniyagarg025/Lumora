import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, ChevronLeft, ChevronRight, RotateCw, Check, Sparkles, Brain } from 'lucide-react';

export const FlashcardModal = ({ isOpen, onClose, words = [], onToggleMastered }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen || words.length === 0) return null;

  const currentWord = words[currentIndex];
  const isNewspaper = theme === 'newspaper';

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl flex flex-col items-center">
        
        {/* Top Header Controls */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-400" />
            <span className="font-black text-white text-base font-poppins">Spaced Repetition Flashcards</span>
            <span className="text-xs text-amber-200 font-mono font-black">
              ({currentIndex + 1} / {words.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white hover:text-amber-300 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3D Flip Card Container */}
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full h-80 cursor-pointer relative rounded-3xl transition-transform duration-500 transform-gpu"
          style={{ perspective: '1000px' }}
        >
          <div className={`w-full h-full relative transition-all duration-500 rounded-3xl shadow-2xl ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
            
            {/* FRONT OF CARD */}
            <div className={`absolute inset-0 w-full h-full border-2 theme-accent-border rounded-3xl p-8 flex flex-col items-center justify-between text-center [backface-visibility:hidden] shadow-2xl ${
              isNewspaper ? 'bg-[#F3EEE3] text-amber-950' : 'bg-white text-slate-900'
            }`}>
              <span className="text-xs uppercase tracking-widest font-black theme-accent-btn px-3 py-1 rounded-full border">
                Tap to Reveal Definition
              </span>

              <div className="space-y-3">
                <h2 className={`text-4xl font-black tracking-tight font-poppins ${isNewspaper ? 'text-amber-950 font-serif' : 'text-slate-900'}`}>
                  {currentWord.word}
                </h2>
                <p className={`text-sm font-mono font-bold ${isNewspaper ? 'text-amber-900' : 'text-slate-600'}`}>
                  {currentWord.phonetics}
                </p>
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase theme-accent-btn">
                  {currentWord.partOfSpeech}
                </span>
              </div>

              <div className={`flex items-center gap-1.5 text-xs font-bold ${isNewspaper ? 'text-amber-900' : 'text-slate-600'}`}>
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click card to flip</span>
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className={`absolute inset-0 w-full h-full border-2 theme-accent-border rounded-3xl p-8 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-2xl ${
              isNewspaper ? 'bg-[#F3EEE3] text-amber-950' : 'bg-white text-slate-900'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className={`text-2xl font-black font-poppins ${isNewspaper ? 'text-amber-950 font-serif' : 'text-slate-900'}`}>
                    {currentWord.word}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMastered(currentWord.id);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all ${
                      currentWord.isMastered
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{currentWord.isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                  </button>
                </div>

                <div>
                  <p className="text-xs uppercase font-black opacity-70 mb-1">Definition</p>
                  <p className={`text-sm leading-relaxed font-semibold ${isNewspaper ? 'text-amber-950 font-serif' : 'text-slate-900'}`}>
                    {currentWord.definition}
                  </p>
                </div>

                {currentWord.contextSentence && (
                  <div>
                    <p className="text-xs uppercase font-black opacity-70 mb-1">Context Example</p>
                    <p className={`text-xs italic p-3 rounded-xl border font-medium ${
                      isNewspaper ? 'bg-amber-100/60 border-amber-300 text-amber-950 font-serif' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                      "{currentWord.contextSentence}"
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center text-xs font-bold opacity-70">
                Tap card to flip back
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between w-full mt-6">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 border border-white/20 text-slate-900 hover:bg-white transition-all font-black text-sm shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl btn-brand-gradient text-white shadow-lg transition-all font-black text-sm"
          >
            <span>Next Word</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
