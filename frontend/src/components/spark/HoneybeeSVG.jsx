import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const HoneybeeSVG = ({ isFlying, isCelebrating }) => {
  const shouldReduceMotion = useReducedMotion();

  // Rapid wing flap
  const wingTransition = { 
    repeat: Infinity, 
    duration: 0.05, // very fast!
    ease: "linear" 
  };

  const idleWingTransition = {
    repeat: Infinity,
    duration: 0.2,
    ease: "easeInOut"
  };

  const wingProps = shouldReduceMotion ? {} : {
    animate: { rotate: isFlying ? [15, -45, 15] : [0, -10, 0] },
    transition: isFlying ? wingTransition : idleWingTransition
  };

  const bodyProps = shouldReduceMotion ? {} : {
    animate: { 
      y: isFlying ? [0, -4, 0] : [0, -2, 0],
      rotate: isCelebrating ? [0, -15, 15, -15, 15, 0] : (isFlying ? [0, -5, 0] : 0)
    },
    transition: isCelebrating 
      ? { duration: 1 } 
      : { repeat: Infinity, duration: isFlying ? 1.2 : 2.5, ease: "easeInOut" }
  };

  return (
    <motion.div className="relative flex justify-center drop-shadow-2xl" {...bodyProps}>
      <svg width="80" height="80" viewBox="0 0 100 100" className="overflow-visible">
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" /> {/* Yellow 300 */}
            <stop offset="100%" stopColor="#D97706" /> {/* Amber 600 */}
          </linearGradient>
          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Back Wing */}
        <motion.g style={{ originX: "50px", originY: "40px" }} {...wingProps}>
          <ellipse cx="60" cy="25" rx="12" ry="22" fill="url(#wingGradient)" stroke="#CBD5E1" strokeWidth="1" transform="rotate(30 60 25)" />
        </motion.g>

        {/* Legs */}
        <path d="M 40 75 Q 38 85 40 88" fill="none" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 50 78 Q 48 88 50 91" fill="none" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 65 72 Q 68 82 72 82" fill="none" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />

        {/* Stinger */}
        <path d="M 82 55 L 90 53 L 83 58 Z" fill="#451A03" />

        {/* Main Body (Abdomen + Thorax combined for a soft look) */}
        <ellipse cx="55" cy="55" rx="30" ry="22" fill="url(#bodyGradient)" transform="rotate(-15 55 55)" />

        {/* Stripes */}
        <g transform="rotate(-15 55 55)">
          {/* Masked by the body manually using paths */}
          <path d="M 45 34 Q 50 55 42 76 Q 55 77 55 33 Z" fill="#451A03" opacity="0.9" />
          <path d="M 65 37 Q 70 55 60 74 Q 72 73 72 38 Z" fill="#451A03" opacity="0.9" />
        </g>

        {/* Front Wing */}
        <motion.g style={{ originX: "45px", originY: "42px" }} {...wingProps}>
          <ellipse cx="50" cy="22" rx="14" ry="26" fill="url(#wingGradient)" stroke="#F8FAFC" strokeWidth="1.5" transform="rotate(20 50 22)" />
        </motion.g>

        {/* Head */}
        <circle cx="32" cy="50" r="16" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
        
        {/* Antennae */}
        <path d="M 24 38 Q 15 25 10 28" fill="none" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="28" r="2.5" fill="#451A03" />
        
        <path d="M 32 35 Q 30 20 22 18" fill="none" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="18" r="2.5" fill="#451A03" />

        {/* Face */}
        <circle cx="24" cy="48" r="2.5" fill="#451A03" /> {/* Left Eye */}
        <circle cx="36" cy="48" r="2.5" fill="#451A03" /> {/* Right Eye */}
        
        {/* Eye Sparkles */}
        <circle cx="23" cy="47" r="0.8" fill="#FFFFFF" />
        <circle cx="35" cy="47" r="0.8" fill="#FFFFFF" />

        {/* Blush */}
        <circle cx="20" cy="53" r="3" fill="#F87171" opacity="0.6" />
        <circle cx="40" cy="53" r="3" fill="#F87171" opacity="0.6" />

        {/* Cute Smile */}
        <path d="M 28 54 Q 30 57 32 54" fill="none" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />

      </svg>
    </motion.div>
  );
};
