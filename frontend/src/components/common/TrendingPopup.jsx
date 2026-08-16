import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsService } from '../../services/newsService';
import { TrendingUp, X, ExternalLink, Flame } from 'lucide-react';

export const TrendingPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch live top 10 trending headlines
  const { data: trendingArticles } = useQuery({
    queryKey: ['trendingHeadlines'],
    queryFn: async () => {
      const res = await newsService.getNewsFeed('world', '', 0, 10);
      return res.data?.content || [];
    },
  });

  const headlines = trendingArticles || [];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Interactive Floating Mascot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none"
        title="Click to view Top 10 Trending World News!"
      >
        {/* Dynamic Theme Animated Glow Ring */}
        <div className="absolute -inset-2 rounded-full theme-glow-ring opacity-75 blur-md group-hover:opacity-100 transition duration-300 animate-pulse" />

        {/* 3D Pixar Reporter Mascot Image */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-white border-2 theme-accent-border shadow-2xl overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
          <img
            src="/mascot.png"
            alt="Reporter Mascot"
            className="w-full h-full object-contain drop-shadow-md group-hover:rotate-6 transition-transform duration-300"
          />
        </div>

        {/* Floating Trending Badge Indicator */}
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full theme-accent-bg text-[10px] font-black text-white shadow-md border-2 border-white animate-bounce">
          10
        </span>
      </button>

      {/* Interactive Top 10 Trending Headlines Modal Popover */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-80 sm:w-96 max-h-[80vh] bg-white border-2 theme-accent-border rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in z-50">
          
          {/* Popover Header */}
          <div className="p-4 theme-accent-bg text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-300 animate-bounce" />
              <div>
                <h3 className="font-extrabold text-sm font-poppins tracking-tight text-white">Top 10 Trending News</h3>
                <p className="text-[10px] text-white/90 font-medium">Real-time global syndicates</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Headlines List */}
          <div className="p-3 overflow-y-auto divide-y divide-slate-100 space-y-1 max-h-[60vh] bg-slate-50/50">
            {headlines.length > 0 ? (
              headlines.map((item, idx) => (
                <a
                  key={item.id || idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-2xl bg-white hover:bg-slate-100/80 border border-slate-200/80 transition-all flex items-start gap-3 group shadow-xs block"
                >
                  <span className="w-6 h-6 rounded-xl theme-accent-btn text-xs font-black flex items-center justify-center shrink-0 group-hover:theme-accent-bg group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:theme-accent-text line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-700 mt-1 font-semibold">
                      <span>{item.sourceName || 'Times of India'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 theme-accent-text">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>Trending</span>
                      </span>
                    </div>
                  </div>

                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:theme-accent-text shrink-0 mt-1" />
                </a>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 font-medium text-xs">
                Fetching latest headlines...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
