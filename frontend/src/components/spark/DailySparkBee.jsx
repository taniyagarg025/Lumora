import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { HoneybeeSVG } from './HoneybeeSVG';
import { DailySparkCard } from './DailySparkCard';
import { getDailySpark } from '../../data/SparkData';
import { Sparkles } from 'lucide-react';

export const DailySparkBee = () => {
  const [spark, setSpark] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [showSparkItem, setShowSparkItem] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [sparkCollected, setSparkCollected] = useState(false);
  
  const beeControls = useAnimation();
  const sparkControls = useAnimation();

  useEffect(() => {
    // Check local storage for today's spark
    const today = new Date().toISOString().split('T')[0];
    const seenKey = `dailySparkSeen_${today}`;
    
    if (localStorage.getItem(seenKey)) {
      return; // Already seen today
    }

    // Set today's spark
    setSpark(getDailySpark());
    
    // Start entry animation sequence
    const startSequence = async () => {
      // Delay before flying in to let user settle
      await new Promise(r => setTimeout(r, 2000));
      
      setIsVisible(true);
      setIsFlying(true);

      // 1. Bee flies in from bottom right off-screen
      beeControls.set({ x: "100vw", y: 150, scaleX: -1 });
      await beeControls.start({ 
        x: -150, 
        y: -100, 
        transition: { duration: 2, ease: "easeOut" } 
      });

      // 2. Discover the Spark
      setShowSparkItem(true);
      await new Promise(r => setTimeout(r, 500));
      
      // Look around
      await beeControls.start({ rotate: 15, transition: { duration: 0.3 } });
      await beeControls.start({ rotate: -5, transition: { duration: 0.3 } });
      await beeControls.start({ rotate: 0, transition: { duration: 0.2 } });

      // 3. Fly to the spark
      await beeControls.start({ 
        x: -250, 
        y: -180,
        transition: { duration: 1, ease: "easeInOut" }
      });

      // 4. Collect it (hide spark item, celebrate)
      setShowSparkItem(false);
      setIsFlying(false);
      setIsCelebrating(true);
      await new Promise(r => setTimeout(r, 1000));
      setIsCelebrating(false);
      setIsFlying(true);

      // 5. Fly down to resting position
      await beeControls.start({ 
        x: -80, 
        y: -40,
        scaleX: -1, // Face left
        transition: { duration: 1.5, ease: "easeInOut" }
      });
      
      setIsFlying(false);

      // 6. Show Card
      setShowCard(true);
      localStorage.setItem(seenKey, 'true');
    };

    startSequence();
  }, [beeControls]);

  const handleClose = async () => {
    setShowCard(false);
    setSparkCollected(true);
    
    // Tiny celebration
    setIsCelebrating(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsCelebrating(false);
    setIsFlying(true);
    setSparkCollected(false);

    // Fly away
    beeControls.start({ scaleX: 1, transition: { duration: 0.2 } }); // Turn right
    await beeControls.start({ 
      x: "100vw", 
      y: -200, 
      transition: { duration: 2, ease: "easeIn" } 
    });

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 right-0 z-[100] pointer-events-none">
      
      {/* The glowing Spark the bee discovers */}
      <AnimatePresence>
        {showSparkItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [1, 1.2, 1] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-52 right-64 w-4 h-4 bg-amber-300 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)]"
          />
        )}
      </AnimatePresence>

      {/* Spark Collected Toast */}
      <AnimatePresence>
        {sparkCollected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -40 }}
            exit={{ opacity: 0, y: -60 }}
            className="absolute bottom-32 right-12 bg-amber-50 text-amber-700 px-4 py-2 rounded-full font-bold text-xs shadow-lg border border-amber-200 flex items-center gap-2"
          >
            <Sparkles className="w-3 h-3" />
            SPARK COLLECTED
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Bee */}
      <motion.div animate={beeControls} className="absolute bottom-5 right-5 pointer-events-auto cursor-pointer" onClick={() => !showCard && !isFlying && setShowCard(true)}>
        <HoneybeeSVG isFlying={isFlying} isCelebrating={isCelebrating} />
      </motion.div>

      {/* The Note Card */}
      <div className="pointer-events-auto">
        <DailySparkCard 
          spark={spark} 
          isOpen={showCard} 
          onClose={handleClose} 
        />
      </div>

    </div>
  );
};
