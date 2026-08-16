import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService } from '../services/newsService';
import { ArticleCard } from '../components/news/ArticleCard';
import { Search, Sparkles, RefreshCw, AlertCircle, BookOpen, ChevronDown, Radio } from 'lucide-react';

export const FeedPage = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [pageSize, setPageSize] = useState(150);
  const [syncing, setSyncing] = useState(false);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    const timer = setTimeout(() => {
      setDebouncedQuery(val);
    }, 350);
    return () => clearTimeout(timer);
  };

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['newsFeed', selectedCategory, debouncedQuery, pageSize],
    queryFn: async () => {
      const res = await newsService.getNewsFeed(selectedCategory, debouncedQuery, 0, pageSize);
      return res.data;
    },
    keepPreviousData: true,
  });

  const handleSyncLiveFeed = async () => {
    setSyncing(true);
    try {
      await newsService.syncNews(selectedCategory);
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'technology', label: 'Technology' },
    { id: 'business', label: 'Business' },
    { id: 'science', label: 'Science' },
    { id: 'world', label: 'World' },
    { id: 'health', label: 'Health' },
  ];

  const newsSources = [
    { id: 'all',        label: '🌐 All Sources' },
    { id: 'bbc',        label: '📺 BBC News' },
    { id: 'aljazeera',  label: '📡 Al Jazeera' },
    { id: 'thehindu',   label: '🗞️ The Hindu' },
    { id: 'ndtv',       label: '📻 NDTV' },
    { id: 'toi',        label: '📰 Times of India' },
    { id: 'indiatoday', label: '🇮🇳 India Today' },
    { id: 'npr',        label: '🎙️ NPR News' },
    { id: 'abc',        label: '🌏 ABC News' },
    { id: 'techcrunch', label: '⚡ TechCrunch' },
    { id: 'wired',      label: '🔬 Wired' },
    { id: 'espn',       label: '🏏 ESPN' },
  ];

  const articles = data?.content || [];

  const filteredArticles = selectedSource === 'all'
    ? articles
    : articles.filter(a => {
        const srcName = (a.sourceName || '').toLowerCase();
        if (selectedSource === 'bbc')        return srcName.includes('bbc');
        if (selectedSource === 'aljazeera')  return srcName.includes('al jazeera') || srcName.includes('aljazeera');
        if (selectedSource === 'thehindu')   return srcName.includes('hindu');
        if (selectedSource === 'ndtv')       return srcName.includes('ndtv');
        if (selectedSource === 'toi')        return srcName.includes('times of india');
        if (selectedSource === 'indiatoday') return srcName.includes('india today');
        if (selectedSource === 'npr')        return srcName.includes('npr');
        if (selectedSource === 'abc')        return srcName.includes('abc');
        if (selectedSource === 'techcrunch') return srcName.includes('techcrunch');
        if (selectedSource === 'wired')      return srcName.includes('wired');
        if (selectedSource === 'espn')       return srcName.includes('espn');
        return true;
      });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-poppins">
              Daily 10-Min News Feed
            </h1>
            <Sparkles className="w-5 h-5 theme-accent-text animate-pulse" />
          </div>
          <p className="opacity-70 text-xs sm:text-sm font-semibold">
            Live headlines from BBC, Al Jazeera, The Hindu, NDTV, India Today, NPR, TechCrunch & more — refreshed every 30 min.
          </p>
        </div>

        {/* Crisp Light Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search topics, news, or AI..."
            className="w-full glass-panel border-2 border-gray-500/20 focus:theme-accent-border rounded-full pl-10 pr-4 py-2 text-xs font-bold focus:outline-none shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Global News App & Platform Selector Bar */}
      <div className="glass-card p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase opacity-80 tracking-wider">
          <Radio className="w-4 h-4 theme-accent-text animate-pulse" />
          <span>Trending News Networks & Apps:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {newsSources.map((src) => (
            <button
              key={src.id}
              onClick={() => setSelectedSource(src.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                selectedSource === src.id
                  ? 'btn-brand-gradient active-nav-pill text-white shadow-xs'
                  : 'bg-gray-500/10 hover:bg-gray-500/20 border border-gray-500/20'
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Category Pills */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setPageSize(50);
              }}
              className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'btn-brand-gradient active-nav-pill text-white shadow-md'
                  : 'glass-panel opacity-80 hover:opacity-100 border-2 border-gray-500/20 shadow-xs'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleSyncLiveFeed}
          disabled={syncing || isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-2 border-gray-500/20 text-xs font-extrabold opacity-80 hover:opacity-100 shadow-xs transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${(syncing || isFetching) ? 'animate-spin theme-accent-text' : ''}`} />
          <span>{(syncing || isFetching) ? 'Syncing...' : 'Sync Live Feed'}</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="soft-card h-96 rounded-3xl animate-pulse p-4 flex flex-col justify-between glass-card">
              <div className="bg-gray-500/20 h-48 rounded-2xl w-full mb-4" />
              <div className="space-y-3 flex-1">
                <div className="bg-gray-500/20 h-4 rounded w-1/3" />
                <div className="bg-gray-500/20 h-6 rounded w-3/4" />
                <div className="bg-gray-500/20 h-4 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error View */}
      {isError && (
        <div className="soft-card p-8 rounded-3xl border border-rose-200 text-center max-w-md mx-auto my-12 glass-card shadow-xs">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold mb-1">Unable to load news feed</h3>
          <p className="opacity-70 text-xs mb-4">Please check your network connection.</p>
          <button
            onClick={handleSyncLiveFeed}
            className="px-4 py-2 rounded-xl btn-brand-gradient text-white text-xs font-bold transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty View */}
      {!isLoading && !isError && filteredArticles.length === 0 && (
        <div className="soft-card p-12 rounded-3xl border border-gray-500/20 text-center max-w-md mx-auto my-12 glass-card space-y-4 shadow-xs">
          <BookOpen className="w-12 h-12 theme-accent-text mx-auto" />
          <div>
            <h3 className="text-base font-bold mb-1">
              No headlines found for selected filters
            </h3>
            <p className="opacity-70 text-xs font-medium">
              Click below to sync live multi-source headlines into your feed.
            </p>
          </div>
          <button
            onClick={handleSyncLiveFeed}
            disabled={syncing}
            className="px-6 py-2.5 rounded-full btn-brand-gradient text-white text-xs font-black shadow-md flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Multi-Source Headlines'}</span>
          </button>
        </div>
      )}

      {/* Article Hierarchy View */}
      {!isLoading && !isError && filteredArticles.length > 0 && (
        <div className="space-y-12">
          
          {/* 1. Most Important Story (Hero) */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black font-serif border-b-2 border-gray-500/20 pb-2">Top Story</h2>
            <ArticleCard article={filteredArticles[0]} featured={true} />
          </div>

          {/* 2. Today's Essential Stories */}
          {filteredArticles.length > 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black font-serif border-b-2 border-gray-500/20 pb-2">The Essentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.slice(1, 3).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* 3. Category / Other Stories */}
          {filteredArticles.length > 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black font-serif border-b-2 border-gray-500/20 pb-2">Latest News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.slice(3).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Load More Pagination Button */}
          {data.totalElements > articles.length && (
            <div className="text-center pt-8">
              <button
                onClick={() => setPageSize((prev) => prev + 12)}
                disabled={isFetching}
                className="px-10 py-3 rounded-full glass-panel border border-gray-500/20 hover:theme-accent-border text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <span>{isFetching ? 'Loading...' : 'Load More Headlines'}</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
