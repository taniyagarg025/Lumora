import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService } from '../services/newsService';
import { habitService } from '../services/habitService';
import { aiService } from '../services/aiService';
import { vocabService } from '../services/vocabService';
import { HighlightToolbar } from '../components/notes/HighlightToolbar';
import {
  ArrowLeft, Clock, Sparkles, Brain, Bookmark, Type, Plus, Minus,
  Share2, Check, HelpCircle, FileText, Zap, Network, UserCheck, Globe, Building2, Lightbulb, Loader2, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ArticleDetailPage = () => {
  const { id } = useParams();
  const articleRef = useRef(null);
  const queryClient = useQueryClient();

  // Reader Customization State
  const [fontSize, setFontSize] = useState(18);
  const [fontFamily, setFontFamily] = useState('serif');
  const [readProgress, setReadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Inline AI Suite State
  const [activeAiTab, setActiveAiTab] = useState(null); // null, 'summary', 'vocab'
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [vocabData, setVocabData] = useState(null);
  const [loadingVocab, setLoadingVocab] = useState(false);
  const [savedWords, setSavedWords] = useState(new Set());

  // Mind Map State
  const [mindMapData, setMindMapData] = useState(null);
  const [loadingMindMap, setLoadingMindMap] = useState(false);

  // Fetch article detail
  const { data: articleRes, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const res = await newsService.getArticleById(id);
      return res.data;
    },
  });

  const article = articleRes;

  // Save Vocab Mutation
  const saveVocabMutation = useMutation({
    mutationFn: (data) => vocabService.saveWord(data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(['vocabulary']);
      setSavedWords((prev) => new Set(prev).add(variables.word));
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    },
    onError: (error, variables) => {
      // If the word is already saved, the backend throws a 400. We can just mark it as saved locally.
      if (error.response?.status === 400) {
        setSavedWords((prev) => new Set(prev).add(variables.word));
      }
    }
  });

  useEffect(() => {
    if (article?.id) {
      habitService.logArticleRead(article.id).catch(console.error);
      
      // Fetch dynamic mind map if not loaded
      if (!mindMapData && !loadingMindMap) {
        fetchMindMap();
      }
    }
  }, [article?.id]);

  const fetchMindMap = async () => {
    if (!article) return;
    setLoadingMindMap(true);
    try {
      const res = await aiService.extractEntities(article.content || article.title);
      if (res.success) {
        setMindMapData(res.data.entities);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMindMap(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  // AI Triggers
  const handleToggleAiTab = (tab) => {
    if (activeAiTab === tab) {
      setActiveAiTab(null);
      return;
    }
    setActiveAiTab(tab);
    if (tab === 'summary' && !summaryData) fetchSummary();
    if (tab === 'vocab' && !vocabData) fetchVocab();
  };

  const fetchSummary = async () => {
    if (!article) return;
    setLoadingSummary(true);
    try {
      const res = await aiService.summarizeArticle(article.id, article.content || article.title);
      if (res.success) setSummaryData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchVocab = async () => {
    if (!article) return;
    setLoadingVocab(true);
    try {
      const res = await aiService.extractVocabulary(article.content || article.title);
      if (res.success) setVocabData(res.data.words);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVocab(false);
    }
  };

  const handleSaveWordToVault = (item) => {
    if (savedWords.has(item.word)) return;
    saveVocabMutation.mutate({
      articleId: article.id,
      word: item.word,
      phonetics: item.phonetics || '',
      partOfSpeech: item.partOfSpeech || 'noun',
      definition: item.definition || '',
      contextSentence: item.contextSentence || '',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-12 bg-slate-200 rounded w-3/4" />
        <div className="h-96 bg-slate-200 rounded-3xl w-full" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Article Not Found</h2>
        <p className="text-slate-500 text-xs mb-6">The requested article could not be loaded.</p>
        <Link to="/feed" className="px-4 py-2 btn-brand-gradient text-white text-xs font-bold rounded-xl shadow-md">
          Back to Feed
        </Link>
      </div>
    );
  }



  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 pb-24 animate-fade-in">

      {/* Scroll Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-50">
        <div
          className="h-full theme-accent-bg transition-all duration-150 shadow-sm"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Reader Controls Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <Link to="/feed" className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:theme-accent-text transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Feed</span>
          </Link>

          {/* Typography Controls */}
          <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <div className="flex items-center gap-1">
              {['serif', 'sans', 'mono'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFontFamily(f)}
                  className={`px-2 py-0.5 rounded text-[11px] font-black uppercase transition-all ${fontFamily === f ? 'btn-brand-gradient active-nav-pill text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-300" />

            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontSize((prev) => Math.max(14, prev - 1))}
                className="p-1 text-slate-700 hover:text-slate-900 font-black"
                title="Decrease Font Size"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono font-black text-slate-800 w-6 text-center">{fontSize}px</span>
              <button
                onClick={() => setFontSize((prev) => Math.min(26, prev + 1))}
                className="p-1 text-slate-700 hover:text-slate-900 font-black"
                title="Increase Font Size"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="p-2 text-slate-700 hover:theme-accent-text transition-colors"
            title="Share Article"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-3xl mx-auto px-4 pt-10 space-y-8">

        {/* Article Meta Header */}
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-600 mb-4 font-bold">
            <span className="px-3 py-1 rounded-full theme-accent-btn font-black uppercase tracking-wider">
              {article.category || 'News'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-black text-slate-800">
              <Clock className="w-3.5 h-3.5 theme-accent-text" />
              {article.readTimeMinutes || 4} min read
            </span>
            <span>•</span>
            <span>{new Date(article.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6 font-poppins">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
            <div className="w-10 h-10 rounded-full theme-accent-bg font-black text-white flex items-center justify-center text-sm shadow-md">
              {article.sourceName?.charAt(0) || 'G'}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{article.author || article.sourceName || 'Global Editorial Team'}</p>
              <p className="text-xs text-slate-600 font-bold">Published via {article.sourceName || 'News Syndicate'}</p>
            </div>
          </div>
        </div>

        {/* ⚡ 5-SECOND EXECUTIVE TL;DR BRIEFING */}
        <div className="glass-card p-6 rounded-3xl bg-white border-2 theme-accent-border shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 theme-accent-text animate-bounce" />
              <h3 className="text-base font-black text-slate-900 font-poppins">5-Second Executive TL;DR</h3>
            </div>
            <span className="px-3 py-1 rounded-full theme-accent-btn text-[10px] font-black uppercase tracking-wider">
              ⚡ Instant Key Takeaway
            </span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-black text-[10px] uppercase shrink-0 mt-0.5">
                What Happened
              </span>
              <p className="font-bold text-slate-900">{article.title}</p>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[10px] uppercase shrink-0 mt-0.5">
                Why It Matters
              </span>
              <p className="font-medium text-slate-800">{article.description}</p>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="px-2 py-0.5 rounded theme-accent-btn font-black text-[10px] uppercase shrink-0 mt-0.5">
                What's Next
              </span>
              <p className="font-medium text-slate-800">
                Take the comprehension quiz below to test your understanding and save key terms to your Vocabulary Vault!
              </p>
            </div>
          </div>
        </div>

        {/* 📊 AI MIND MAP & KNOWLEDGE GRAPH */}
        <div className="glass-card p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 theme-accent-text" />
              <h3 className="text-base font-black text-slate-900 font-poppins">AI Knowledge Mind Map</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">Interactive Entity Breakdown</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {loadingMindMap ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 py-8 text-center text-slate-600 space-y-2">
                <Loader2 className="w-7 h-7 theme-accent-text animate-spin mx-auto" />
                <p className="text-xs font-bold">Extracting key entities with Gemini AI...</p>
              </div>
            ) : mindMapData && mindMapData.length > 0 ? (
              mindMapData.map((ent, idx) => {
                const getIconForCategory = (category) => {
                  if (category?.toLowerCase().includes('figure')) return UserCheck;
                  if (category?.toLowerCase().includes('location') || category?.toLowerCase().includes('region')) return Globe;
                  if (category?.toLowerCase().includes('syndicate') || category?.toLowerCase().includes('source')) return Building2;
                  return Lightbulb;
                };
                const IconComp = getIconForCategory(ent.category);
                const isSelected = selectedEntity === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedEntity(isSelected ? null : idx)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${isSelected
                        ? 'theme-accent-btn border-2 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComp className="w-4 h-4 theme-accent-text" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{ent.category}</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900">{ent.name}</h4>
                    <p className="text-[11px] text-slate-600 font-semibold mt-1">{ent.detail}</p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-4 text-xs font-bold text-slate-600">
                Failed to load entities.
              </div>
            )}
          </div>
        </div>

        {/* INLINE AI READER SUITE TOOLBAR */}
        <div className="glass-card p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 theme-accent-text" />
              <span className="text-sm font-black text-slate-900 font-poppins">Gemini AI Reader Suite</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleToggleAiTab('summary')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-xs ${activeAiTab === 'summary'
                    ? 'btn-brand-gradient text-white'
                    : 'theme-accent-btn'
                  }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full AI Breakdown</span>
              </button>

              <button
                onClick={() => handleToggleAiTab('vocab')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-xs ${activeAiTab === 'vocab'
                    ? 'btn-brand-gradient text-white'
                    : 'theme-accent-btn'
                  }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Extract Vocab</span>
              </button>

              <Link
                to={`/quizzes?articleId=${article.id}`}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl btn-brand-gradient text-white text-xs font-black transition-all shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Take Quiz</span>
              </Link>
            </div>
          </div>

          {/* INLINE EXPANDABLE CONTENT SECTION */}
          {activeAiTab && (
            <div className="pt-4 border-t border-slate-200 animate-fade-in space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-600 tracking-wider">
                  {activeAiTab === 'summary' ? '📋 Executive 3-Bullet Analysis' : '🧠 Extracted Key Vocabulary'}
                </span>
                <button
                  onClick={() => setActiveAiTab(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Summary View */}
              {activeAiTab === 'summary' && (
                <div>
                  {loadingSummary ? (
                    <div className="py-8 text-center text-slate-600 space-y-2">
                      <Loader2 className="w-7 h-7 theme-accent-text animate-spin mx-auto" />
                      <p className="text-xs font-bold">Analyzing article with Google Gemini AI...</p>
                    </div>
                  ) : summaryData ? (
                    <div className="space-y-2.5">
                      {summaryData.bulletPoints?.map((bullet, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full theme-accent-btn font-black flex items-center justify-center text-xs shrink-0 mt-0.5 border">
                            {idx + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-semibold">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs font-bold text-slate-600">Generating summary...</div>
                  )}
                </div>
              )}

              {/* Vocab View */}
              {activeAiTab === 'vocab' && (
                <div>
                  {loadingVocab ? (
                    <div className="py-8 text-center text-slate-600 space-y-2">
                      <Loader2 className="w-7 h-7 theme-accent-text animate-spin mx-auto" />
                      <p className="text-xs font-bold">Extracting key vocabulary with Gemini AI...</p>
                    </div>
                  ) : vocabData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {vocabData.map((item, idx) => {
                        const isSaved = savedWords.has(item.word);
                        return (
                          <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <h5 className="font-black text-xs sm:text-sm text-slate-900 font-poppins">{item.word}</h5>
                                <span className="text-[10px] text-slate-500 font-mono font-bold">{item.phonetics}</span>
                              </div>
                              <button
                                onClick={() => handleSaveWordToVault(item)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all ${isSaved
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'btn-brand-gradient text-white shadow-xs'
                                  }`}
                              >
                                {isSaved ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                <span>{isSaved ? 'Saved to Vault' : 'Save to Vault'}</span>
                              </button>
                            </div>
                            <p className="text-xs text-slate-800 font-semibold leading-snug">{item.definition}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs font-bold text-slate-600">Extracting words...</div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Cover Image */}
        {article.urlToImage && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div
          ref={articleRef}
          className={`prose prose-slate max-w-none text-slate-900 leading-relaxed space-y-6 ${getFontFamilyClass()}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <p className="text-lg sm:text-xl font-semibold text-slate-800 leading-normal border-l-4 theme-accent-border pl-4 py-1 italic bg-slate-50 rounded-r-xl">
            {article.description}
          </p>

          <div className="whitespace-pre-line space-y-4 font-medium">
            {article.content || `
              In today's rapidly evolving global landscape, technological and economic developments continue to reshape industry standards. Key leaders and domain experts emphasize the critical necessity of adapting to these structural transformations. As organizations re-evaluate their long-term strategies, continuous learning and data-driven insights have emerged as paramount competitive advantages.
            `}
          </div>
        </div>

      </article>

      {/* Floating Highlight Selection Toolbar */}
      <HighlightToolbar
        articleId={article.id}
        containerRef={articleRef}
      />
    </div>
  );
};
