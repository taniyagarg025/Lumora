import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Brain, Target, Sparkles, ArrowRight, CheckCircle2,
  Newspaper, Layers, Zap, Clock
} from 'lucide-react';

export const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen bg-[#F7F1E6] overflow-hidden font-sans">
      
      {/* Decorative Editorial Background Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 right-0 w-1/2 h-[600px] bg-gradient-to-bl from-[#7C350F]/10 to-transparent rounded-bl-[100%] pointer-events-none" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-[800px] h-[400px] bg-gradient-to-tr from-[#C96A2B]/10 to-transparent rounded-tr-[100%] pointer-events-none" 
      />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-20 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
        >
          
          {/* Pill Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#7C350F]/10 border border-[#7C350F]/20 text-[#7C350F] text-xs sm:text-sm font-bold tracking-wide shadow-sm"
          >
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="uppercase tracking-widest">Turn 15 minutes a day into lifelong knowledge</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#29221D] tracking-tight leading-[1.05] font-serif"
          >
            A smarter way to <br className="hidden sm:block" />
            <span className="text-[#7C350F] italic font-serif relative inline-block">
              learn every day.
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                className="absolute bottom-1 left-0 h-1 bg-[#C96A2B]/40 rounded-full"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-[#8A8178] max-w-2xl leading-relaxed font-medium"
          >
            Lumora is your personal daily knowledge companion. We distill global news, teach you essential life skills, and train your brain—all in just 15 minutes a day.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#7C350F] text-[#F7F1E6] text-base font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-shadow group"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#E5DEC9" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-white border border-[#E5DEC9] text-[#29221D] text-base font-bold shadow-sm transition-colors text-center"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-8 text-sm font-semibold text-[#8A8178]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4F7D52]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4F7D52]" />
              <span>Personalized curriculum</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: THE 15-MINUTE METHOD */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl sm:text-5xl font-black text-[#29221D] font-serif">The Daily Knowledge Journey</h2>
          <p className="text-[#8A8178] text-lg font-medium max-w-2xl mx-auto">
            We've engineered the perfect morning routine. Stop doomscrolling and start building real intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {[
            { icon: Newspaper, color: "#7C350F", step: "1. Know (5 min)", desc: "Catch up on the world. AI-distilled executive summaries of the most important global events, stripped of noise and bias." },
            { icon: Sparkles, color: "#C96A2B", step: "2. Learn (3 min)", desc: "Master one new concept every day. From compound interest to cognitive biases, explained simply with real-world examples." },
            { icon: Layers, color: "#4F7D52", step: "3. Build (2 min)", desc: "Expand your vocabulary. Discover a new word, its pronunciation, and how to use it powerfully in everyday communication." },
            { icon: Brain, color: "#29221D", step: "4. Think (5 min)", desc: "Train your cognitive muscles. Daily logic puzzles, memory challenges, and quick quizzes to lock in what you've learned." },
          ].map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-[#E5DEC9] cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="w-7 h-7" style={{ color: card.color }} />
              </div>
              <h3 className="text-2xl font-bold text-[#29221D] mb-3 font-serif">{card.step}</h3>
              <p className="text-[#8A8178] text-sm leading-relaxed font-medium">
                {card.desc}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* SECTION 3: BOTTOM CTA */}
      <section className="py-24 px-4 sm:px-6 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto bg-[#29221D] rounded-[40px] p-10 sm:p-20 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Subtle bg graphic */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-96 h-96 bg-[#7C350F] rounded-full blur-[100px] pointer-events-none" 
          />
          
          <h2 className="text-4xl sm:text-6xl font-black text-[#F7F1E6] mb-6 font-serif relative z-10 leading-tight">
            Ready to become the smartest person in the room?
          </h2>
          <p className="text-[#8A8178] text-lg sm:text-xl mb-12 max-w-xl mx-auto font-medium relative z-10">
            Join thousands of professionals who start their morning with Lumora.
          </p>
          
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-[#C96A2B] text-[#F7F1E6] text-lg font-bold shadow-xl relative z-10"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>Start Your 15-Minute Habit</span>
            </motion.button>
          </Link>
        </motion.div>
      </section>

    </div>
  );
};

export default LandingPage;
