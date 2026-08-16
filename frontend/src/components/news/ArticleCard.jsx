import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Bookmark, Zap } from 'lucide-react';

export const ArticleCard = ({ article, featured = false }) => {
  const getCategoryBadge = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'technology': return 'bg-[#7C350F]/10 text-[#7C350F] border-[#7C350F]/30';
      case 'business': return 'bg-[#C96A2B]/10 text-[#C96A2B] border-[#C96A2B]/30';
      case 'science': return 'bg-[#4F7D52]/10 text-[#4F7D52] border-[#4F7D52]/30';
      default: return 'bg-[#E5DEC9]/50 text-[#29221D] border-[#E5DEC9]';
    }
  };

  return (
    <div className={`flex flex-col glass-card rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 ${featured ? 'md:flex-row md:col-span-2 lg:col-span-3' : ''}`}>
      
      {/* Image */}
      <div className={`relative bg-black/5 overflow-hidden ${featured ? 'md:w-1/2 h-64 md:h-auto' : 'h-48 w-full'}`}>
        <img
          src={article.urlToImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'; }}
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border backdrop-blur-md ${getCategoryBadge(article.category)}`}>
            {article.category || 'News'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={`p-6 flex-1 flex flex-col justify-between ${featured ? 'md:w-1/2' : ''}`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold opacity-60 mb-3">
            <span className="opacity-100">{article.sourceName || 'Global Syndicate'}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTimeMinutes || 4} min read</span>
            </div>
            <span>•</span>
            <span>{new Date(article.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>

          <h3 className={`${featured ? 'text-2xl sm:text-3xl' : 'text-lg'} font-black mb-3 font-serif line-clamp-3 group-hover:theme-accent-text transition-colors leading-snug`}>
            {article.title}
          </h3>

          <p className="opacity-70 text-sm line-clamp-2 mb-4 font-medium">
            {article.description}
          </p>

          {/* Why it matters */}
          <div className="mb-6 p-3 rounded-xl theme-accent-btn border theme-accent-border space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black theme-accent-text">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="uppercase tracking-wider">Why it matters</span>
            </div>
            <p className="opacity-90 text-xs font-medium line-clamp-2 leading-relaxed">
              {article.summaryBullet1 || 'This development significantly impacts current industry trends and global economic forecasts.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-500/20 flex items-center justify-between">
          <Link
            to={`/article/${article.id}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full btn-brand-gradient text-white hover:opacity-90 text-xs font-bold transition-all shadow-sm"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button className="p-2 rounded-full opacity-50 hover:opacity-100 hover:theme-accent-text hover:bg-gray-500/10 transition-colors" title="Bookmark">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
