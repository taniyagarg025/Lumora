import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vocabService } from '../services/vocabService';
import { FlashcardModal } from '../components/vocabulary/FlashcardModal';
import { 
  Brain, Sparkles, Search, Trash2, Plus, Check, Play, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VocabularyVaultPage = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'learning', 'mastered'
  const [search, setSearch] = useState('');
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Word Form State
  const [newWord, setNewWord] = useState('');
  const [newPhonetics, setNewPhonetics] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('noun');
  const [newDefinition, setNewDefinition] = useState('');
  const [newContext, setNewContext] = useState('');

  const queryClient = useQueryClient();

  const { data: vocabList = [], isLoading } = useQuery({
    queryKey: ['vocabulary', filter],
    queryFn: async () => {
      const isMasteredParam = filter === 'mastered' ? true : filter === 'learning' ? false : null;
      const res = await vocabService.getVocabulary(isMasteredParam);
      return res.data;
    },
  });

  const toggleMasteredMutation = useMutation({
    mutationFn: (id) => vocabService.toggleMastered(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['vocabulary']);
      if (data.data.isMastered) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }
    },
  });

  const deleteWordMutation = useMutation({
    mutationFn: (id) => vocabService.deleteWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['vocabulary']);
    },
  });

  const addWordMutation = useMutation({
    mutationFn: (data) => vocabService.saveWord(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vocabulary']);
      setShowAddModal(false);
      setNewWord('');
      setNewPhonetics('');
      setNewDefinition('');
      setNewContext('');
    },
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addWordMutation.mutate({
      word: newWord,
      phonetics: newPhonetics,
      partOfSpeech: newPartOfSpeech,
      definition: newDefinition,
      contextSentence: newContext,
    });
  };

  const filteredWords = vocabList.filter(
    (item) =>
      item.word.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase())
  );

  const totalCount = vocabList.length;
  const masteredCount = vocabList.filter((w) => w.isMastered).length;
  const learningCount = totalCount - masteredCount;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-2 border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif mb-2">
            Vocabulary Vault
          </h1>
          <p className="text-slate-500 font-medium">
            Your personal lexicon. Master high-impact words daily.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:theme-accent-border text-slate-900 text-sm font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 theme-accent-text" />
            <span>Add Word</span>
          </button>

          <button
            onClick={() => setIsFlashcardOpen(true)}
            disabled={vocabList.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full theme-accent-bg text-white font-bold shadow-sm transition-all disabled:opacity-50 hover:opacity-90"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Review {learningCount} Words</span>
          </button>
        </div>
      </div>

      {/* Featured Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Word of the Day */}
        <div className="md:col-span-2 theme-hero-bg rounded-3xl p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="uppercase tracking-wider">Word of the Day</span>
            </div>
            
            <div className="flex items-end gap-4 mb-2">
              <h2 className="text-4xl font-black text-white font-serif">Ephemeral</h2>
              <span className="text-slate-400 font-mono text-sm mb-1.5">/ɪˈfem.ər.əl/</span>
            </div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-black bg-white/10 text-slate-300 mb-4">
              adjective
            </span>
            
            <p className="text-lg text-white mb-4 font-medium">Lasting for a very short time.</p>
            <p className="text-sm italic text-slate-400">"Fame in the digital age is often ephemeral."</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-6">Vault Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Mastered</span>
                <span className="font-black text-emerald-600">{masteredCount}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Learning</span>
                <span className="font-black theme-accent-text">{learningCount}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Total</span>
                <span className="font-black text-slate-900">{totalCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Words' },
            { id: 'learning', label: 'Learning' },
            { id: 'mastered', label: 'Mastered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:theme-accent-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vault..."
            className="w-full bg-white border border-slate-200 focus:theme-accent-border rounded-full pl-11 pr-4 py-2 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && filteredWords.length === 0 && (
        <div className="p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto bg-white space-y-4">
          <BookOpen className="w-12 h-12 theme-accent-text mx-auto" />
          <div>
            <h3 className="text-lg font-black text-slate-900 font-serif mb-1">No words found</h3>
            <p className="text-slate-500 text-sm font-medium">
              Read articles and use AI to extract vocabulary!
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 theme-accent-bg text-white font-bold text-sm rounded-full shadow-sm hover:opacity-90"
          >
            Add Word Manually
          </button>
        </div>
      )}

      {/* Word Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWords.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border relative flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${
              item.isMastered ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight font-serif">{item.word}</h3>
                  <p className="text-xs font-mono text-slate-500 font-bold">{item.phonetics}</p>
                </div>

                <button
                  onClick={() => toggleMasteredMutation.mutate(item.id)}
                  className={`p-2 rounded-full border transition-all ${
                    item.isMastered
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-400 border-slate-200 hover:text-emerald-600 hover:border-emerald-600'
                  }`}
                  title={item.isMastered ? 'Mastered (Click to unmark)' : 'Mark as Mastered'}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-black bg-slate-100 text-slate-900 mb-3">
                {item.partOfSpeech || 'word'}
              </div>

              <p className="text-sm text-slate-900 leading-relaxed mb-4 font-medium">{item.definition}</p>

              {item.contextSentence && (
                <p className="text-xs italic text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 font-medium">
                  "{item.contextSentence}"
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              {item.articleTitle ? (
                <span className="text-[11px] text-slate-500 font-bold truncate max-w-[200px]" title={item.articleTitle}>
                  From: {item.articleTitle}
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 font-bold">Custom Vault Word</span>
              )}

              <button
                onClick={() => deleteWordMutation.mutate(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Word"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Flashcard Modal Review */}
      <FlashcardModal
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        words={filteredWords}
        onToggleMastered={(id) => toggleMasteredMutation.mutate(id)}
      />

      {/* Manual Add Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl bg-white border-2 theme-accent-border w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900 font-poppins">Add Custom Vocabulary Word</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">Word</label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Ephemeral"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:theme-accent-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1">Phonetics</label>
                  <input
                    type="text"
                    value={newPhonetics}
                    onChange={(e) => setNewPhonetics(e.target.value)}
                    placeholder="/ɪˈfem.ər.əl/"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:theme-accent-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1">Part of Speech</label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:theme-accent-border"
                  >
                    <option value="noun">Noun</option>
                    <option value="verb">Verb</option>
                    <option value="adjective">Adjective</option>
                    <option value="adverb">Adverb</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">Definition</label>
                <textarea
                  required
                  rows={2}
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="Lasting for a very short time..."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:theme-accent-border"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1">Context Sentence (Optional)</label>
                <input
                  type="text"
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="Fame in the digital age is ephemeral."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:theme-accent-border"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-black text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 btn-brand-gradient text-white font-black text-xs rounded-xl shadow-md"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
