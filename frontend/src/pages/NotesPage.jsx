import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../services/noteService';
import { Bookmark, Search, Trash2, Tag, BookOpen, Clock } from 'lucide-react';

export const NotesPage = () => {
  const [selectedTag, setSelectedTag] = useState('all');
  const [search, setSearch] = useState('');

  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await noteService.getUserNotes();
      return res.data;
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id) => noteService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });

  const getColorStyle = (tag) => {
    switch (tag?.toLowerCase()) {
      case 'yellow': return 'bg-amber-100/50 text-amber-900 border-amber-200';
      case 'emerald': return 'bg-emerald-100/50 text-emerald-900 border-emerald-200';
      case 'indigo': return 'bg-indigo-100/50 text-indigo-900 border-indigo-200';
      case 'purple': return 'bg-purple-100/50 text-purple-900 border-purple-200';
      case 'rose': return 'bg-rose-100/50 text-rose-900 border-rose-200';
      default: return 'bg-slate-100/50 text-slate-500 border-slate-200';
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesTag = selectedTag === 'all' || n.colorTag?.toLowerCase() === selectedTag.toLowerCase();
    const matchesSearch =
      n.highlightedText?.toLowerCase().includes(search.toLowerCase()) ||
      n.noteContent?.toLowerCase().includes(search.toLowerCase()) ||
      n.articleTitle?.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-2 border-gray-500/20 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-serif mb-2">Smart Notebook</h1>
          <p className="opacity-70 font-medium">
            All text snippets and annotations captured from your daily reading.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full glass-panel border border-gray-500/20 focus:theme-accent-border rounded-full pl-11 pr-4 py-2.5 text-sm font-medium placeholder-gray-500/70 focus:outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'yellow', 'emerald', 'indigo', 'purple', 'rose'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              selectedTag === t
                ? 'theme-accent-bg shadow-md'
                : 'bg-gray-500/5 opacity-70 border border-gray-500/20 hover:theme-accent-border hover:opacity-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Empty View */}
      {!isLoading && filteredNotes.length === 0 && (
        <div className="p-16 rounded-3xl border border-gray-500/20 text-center max-w-md mx-auto my-12 glass-card space-y-4 shadow-sm">
          <Bookmark className="w-12 h-12 theme-accent-text mx-auto" />
          <div>
            <h3 className="text-xl font-black font-serif mb-2">No notes found</h3>
            <p className="opacity-70 text-sm font-medium">
              Highlight text in Reader Mode to create instant notes and color-coded tags!
            </p>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div key={note.id} className="p-6 rounded-3xl glass-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wider border ${getColorStyle(note.colorTag)}`}>
                  {note.colorTag || 'general'}
                </span>
                <span className="text-[11px] opacity-50 font-mono font-bold">
                  {new Date(note.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>

              <blockquote className="text-sm opacity-90 italic border-l-4 theme-accent-border pl-4 py-2 bg-gray-500/5 rounded-r-xl mb-5 font-serif font-medium leading-relaxed">
                "{note.highlightedText}"
              </blockquote>

              {note.noteContent && (
                <div className="bg-gray-500/5 p-4 rounded-2xl border border-gray-500/20 mb-4">
                  <strong className="theme-accent-text font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Tag className="w-3 h-3" /> My Note
                  </strong>
                  <p className="text-sm font-medium opacity-90">{note.noteContent}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-500/20 flex items-center justify-between">
              <span className="text-[11px] opacity-70 font-bold truncate max-w-[200px]" title={note.articleTitle}>
                {note.articleTitle || 'Article Note'}
              </span>

              <button
                onClick={() => deleteNoteMutation.mutate(note.id)}
                className="p-1.5 opacity-50 hover:opacity-100 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
