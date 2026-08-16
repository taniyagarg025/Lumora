import React, { useState, useEffect, useCallback } from 'react';
import { 
  Circle, Square, Triangle, Hexagon, Star, Diamond,
  Timer, Target, Trophy, ArrowLeft, RefreshCw
} from 'lucide-react';

const SHAPES = [Circle, Square, Triangle, Hexagon, Star, Diamond];

const generatePattern = () => {
  // Simple logic to generate a pattern
  const patternTypes = ['ABAB', 'ABBA', 'AABB', 'ABCABC'];
  const type = patternTypes[Math.floor(Math.random() * patternTypes.length)];
  
  // Pick distinct shapes
  const selectedShapes = [...SHAPES].sort(() => 0.5 - Math.random()).slice(0, 3);
  const A = selectedShapes[0];
  const B = selectedShapes[1];
  const C = selectedShapes[2];
  
  let sequence = [];
  if (type === 'ABAB') sequence = [A, B, A, B, A];
  else if (type === 'ABBA') sequence = [A, B, B, A, A, B, B];
  else if (type === 'AABB') sequence = [A, A, B, B, A, A];
  else if (type === 'ABCABC') sequence = [A, B, C, A, B, C, A];
  
  // The answer is the last element
  const answer = sequence[sequence.length - 1];
  const displaySequence = sequence.slice(0, sequence.length - 1);
  
  // Generate options (include the answer, plus 3 random distinct shapes)
  let options = [answer];
  let availableForOptions = SHAPES.filter(s => s !== answer);
  options = options.concat(availableForOptions.sort(() => 0.5 - Math.random()).slice(0, 3));
  options = options.sort(() => 0.5 - Math.random());
  
  return {
    displaySequence,
    answer,
    options
  };
};

export const PatternRecognitionGame = ({ onExit }) => {
  const [gameState, setGameState] = useState('playing'); // 'playing', 'finished'
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentPattern, setCurrentPattern] = useState(generatePattern());
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    if (timeLeft <= 0) {
      setGameState('finished');
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const handleOptionClick = (option) => {
    if (gameState !== 'playing' || feedback) return; // prevent multi-click
    
    if (option === currentPattern.answer) {
      setScore(prev => prev + 10 + (streak * 2));
      setStreak(prev => prev + 1);
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setCurrentPattern(generatePattern());
      }, 500);
    } else {
      setStreak(0);
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
      }, 500);
    }
  };

  if (gameState === 'finished') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 theme-accent-bg" />
          
          <div className="w-24 h-24 rounded-full theme-accent-bg bg-opacity-10 flex items-center justify-center mx-auto mb-6 bg-slate-100">
            <Trophy className="w-12 h-12 theme-accent-text" />
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 font-serif mb-2">Time's Up!</h2>
          <p className="text-slate-500 font-medium mb-8">You've completed your daily cognitive workout.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-200">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Final Score</p>
            <p className="text-5xl font-black theme-accent-text">{score}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setScore(0);
                setStreak(0);
                setTimeLeft(60);
                setCurrentPattern(generatePattern());
                setGameState('playing');
              }}
              className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Play Again
            </button>
            <button 
              onClick={onExit}
              className="px-8 py-3 rounded-full bg-white border border-slate-200 text-slate-900 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Brain Gym
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Exit Game
        </button>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
            <span className={`font-black text-lg ${timeLeft <= 10 ? 'text-rose-500' : 'text-slate-900'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Target className="w-5 h-5 theme-accent-text" />
            <span className="font-black text-lg text-slate-900">{score}</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Feedback Overlay */}
        {feedback && (
          <div className={`absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
            <span className="text-6xl font-black uppercase tracking-widest animate-bounce">
              {feedback === 'correct' ? 'Correct!' : 'Miss!'}
            </span>
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-slate-900 font-serif mb-2">Identify the Pattern</h2>
          <p className="text-slate-500">Select the shape that comes next in the sequence.</p>
        </div>

        {/* Sequence Display */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-16">
          {currentPattern.displaySequence.map((Shape, idx) => (
            <div key={idx} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center shadow-sm">
              <Shape className="w-8 h-8 sm:w-10 sm:h-10 text-slate-700" />
            </div>
          ))}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 border-slate-900 flex items-center justify-center shadow-md animate-pulse">
            <span className="text-3xl font-black text-white">?</span>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {currentPattern.options.map((OptionShape, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(OptionShape)}
              className="w-full aspect-square rounded-2xl bg-white border-2 border-slate-200 hover:theme-accent-border hover:bg-slate-50 flex items-center justify-center transition-all shadow-sm hover:shadow-md group"
            >
              <OptionShape className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 group-hover:theme-accent-text transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
