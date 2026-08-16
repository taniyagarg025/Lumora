import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DailySparkCard = ({ spark, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!spark) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 30, scale: 0.9, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute bottom-28 right-0 md:right-8 w-80 sm:w-96 bg-[#FDFBF7] rounded-[32px] shadow-2xl border border-[#E5E0D8] overflow-hidden z-[100] font-sans"
        >
          {/* Card Header */}
          <div className="px-8 pt-8 pb-4 relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-1.5 rounded-full text-[#8A8178] hover:bg-[#E5E0D8] hover:text-[#29221D] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold text-amber-700 tracking-widest uppercase">Daily Spark</span>
            </div>
            
            <h3 className="text-2xl font-black text-[#29221D] font-serif leading-tight">
              {spark.question}
            </h3>
            
            <p className="text-sm font-medium text-[#8A8178] mt-3">
              {spark.teaser}
            </p>
          </div>

          {/* Action Area */}
          <div className="px-8 pb-8 pt-4 flex items-center justify-between">
            <button 
              onClick={() => {
                onClose();
                // Pass spark id as state to let LearnPage know which to open
                navigate('/learn', { state: { sparkId: spark.id } });
              }}
              className="group flex items-center gap-2 px-6 py-3 bg-[#29221D] text-white rounded-full font-bold text-sm hover:bg-[#453A31] transition-all active:scale-95"
            >
              Explore
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={onClose}
              className="text-sm font-bold text-[#8A8178] hover:text-[#29221D] transition-colors"
            >
              Maybe Later
            </button>
          </div>

          {/* Decorative Corner Fold */}
          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-white/40 to-transparent pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
