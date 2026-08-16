import React, { useState, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import { Sparkles, X, FileText, Brain, Loader2, Check, Plus } from 'lucide-react';

export const AiReaderDrawer = ({ isOpen, onClose, articleId, articleText, articleTitle }) => {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'simplify', 'vocab'
  
  // AI States
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [simplifyData, setSimplifyData] = useState(null);
  const [simplifyLevel, setSimplifyLevel] = useState('SIMPLE');
  const [loadingSimplify, setLoadingSimplify] = useState(false);

  const [vocabData, setVocabData] = useState(null);
  const [loadingVocab, setLoadingVocab] = useState(false);
  const [savedWords, setSavedWords] = useState(new Set());

  // Automatically fetch AI summary when modal opens
  useEffect(() => {
    if (isOpen && !summaryData && !loadingSummary) {
      handleFetchSummary();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Triggers
  const handleFetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await aiService.summarizeArticle(articleId, articleText || articleTitle);
      if (res.success) {
        setSummaryData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleFetchSimplify = async (level) => {
    setSimplifyLevel(level);
    setLoadingSimplify(true);
    try {
      const res = await aiService.simplifyText(articleText || articleTitle, level);
      if (res.success) {
        setSimplifyData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSimplify(false);
    }
  };

  const handleFetchVocab = async () => {
    setLoadingVocab(true);
    try {
      const res = await aiService.extractVocabulary(articleText || articleTitle);
      if (res.success) {
        setVocabData(res.data.words);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVocab(false);
    }
  };

  const toggleSaveWord = (word) => {
    setSavedWords((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      
      {/* Pop-Out Center Modal Card (Strict overflow-hidden, rounded-3xl) */}
      <div className="relative w-full max-w-2xl bg-white border-2 theme-accent-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Fixed Card Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl theme-accent-btn flex items-center justify-center border shadow-xs">
              <Sparkles className="w-5 h-5 theme-accent-text" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg font-poppins">Gemini AI Assistant</h3>
              <p className="text-xs text-slate-600 font-bold">Intelligent Reading & Comprehension Suite</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-100 border-b border-slate-200 shrink-0">
          {[
            { id: 'summary', label: '3-Bullet Summary', icon: FileText },
            { id: 'simplify', label: 'ELI5 Simplifier', icon: Sparkles },
            { id: 'vocab', label: 'Vocabulary', icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'summary' && !summaryData) handleFetchSummary();
                  if (tab.id === 'simplify' && !simplifyData) handleFetchSimplify('SIMPLE');
                  if (tab.id === 'vocab' && !vocabData) handleFetchVocab();
                }}
                className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'btn-brand-gradient active-nav-pill text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider">Executive Takeaways</h4>
                <button
                  onClick={handleFetchSummary}
                  disabled={loadingSummary}
                  className="text-xs theme-accent-text font-black hover:underline"
                >
                  Regenerate
                </button>
              </div>

              {loadingSummary ? (
                <div className="py-12 text-center text-slate-600 space-y-3">
                  <Loader2 className="w-8 h-8 theme-accent-text animate-spin mx-auto" />
                  <p className="text-xs font-bold">Analyzing article with Google Gemini AI...</p>
                </div>
              ) : summaryData ? (
                <div className="space-y-3">
                  {summaryData.bulletPoints?.map((bullet, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full theme-accent-btn font-black flex items-center justify-center text-xs shrink-0 mt-0.5 border">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-semibold">{bullet}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  onClick={handleFetchSummary}
                  className="w-full py-3.5 rounded-2xl btn-brand-gradient text-white text-xs font-black shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI 3-Bullet Summary</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 2: SIMPLIFIER */}
          {activeTab === 'simplify' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider">Reading Level Switcher</h4>
              </div>

              {/* Level Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'SIMPLE', label: 'ELI5 (Simple)' },
                  { id: 'STANDARD', label: 'Standard' },
                  { id: 'ADVANCED', label: 'Advanced' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => handleFetchSimplify(lvl.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                      simplifyLevel === lvl.id
                        ? 'btn-brand-gradient active-nav-pill text-white shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>

              {loadingSimplify ? (
                <div className="py-12 text-center text-slate-600 space-y-3">
                  <Loader2 className="w-8 h-8 theme-accent-text animate-spin mx-auto" />
                  <p className="text-xs font-bold">Rewriting text for {simplifyLevel} level...</p>
                </div>
              ) : simplifyData ? (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs sm:text-sm text-slate-900 leading-relaxed italic font-serif">
                  "{simplifyData.simplifiedText}"
                </div>
              ) : (
                <button
                  onClick={() => handleFetchSimplify('SIMPLE')}
                  className="w-full py-3.5 rounded-2xl btn-brand-gradient text-white text-xs font-black shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Simplify Article to ELI5</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 3: VOCABULARY */}
          {activeTab === 'vocab' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider">Extracted Vocabulary</h4>
                <button
                  onClick={handleFetchVocab}
                  disabled={loadingVocab}
                  className="text-xs theme-accent-text font-black hover:underline"
                >
                  Refresh Words
                </button>
              </div>

              {loadingVocab ? (
                <div className="py-12 text-center text-slate-600 space-y-3">
                  <Loader2 className="w-8 h-8 theme-accent-text animate-spin mx-auto" />
                  <p className="text-xs font-bold">Extracting key vocabulary with Gemini AI...</p>
                </div>
              ) : vocabData ? (
                <div className="space-y-4">
                  {vocabData.map((item, idx) => {
                    const isSaved = savedWords.has(item.word);
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h5 className="font-black text-sm sm:text-base text-slate-900 font-poppins">{item.word}</h5>
                            <span className="text-xs text-slate-500 font-mono font-bold">{item.phonetics}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black theme-accent-btn">
                              {item.partOfSpeech}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleSaveWord(item.word)}
                            className={`p-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                              isSaved
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                          </button>
                        </div>

                        <p className="text-xs text-slate-800 font-semibold leading-normal">{item.definition}</p>
                        
                        {item.contextSentence && (
                          <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium">
                            "{item.contextSentence}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <button
                  onClick={handleFetchVocab}
                  className="w-full py-3.5 rounded-2xl btn-brand-gradient text-white text-xs font-black shadow-md flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  <span>Extract Vocabulary Words</span>
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
