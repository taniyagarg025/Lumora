import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Bookmark, Plus, X, Check, Sparkles } from 'lucide-react';
import { noteService } from '../../services/noteService';

export const HighlightToolbar = ({ articleId, containerRef, onNoteCreated }) => {
  const { theme } = useTheme();
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [colorTag, setColorTag] = useState('yellow');
  const [saving, setSaving] = useState(false);

  const isNewspaper = theme === 'newspaper';

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length >= 3 && containerRef?.current?.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelectedText(text);
        setPosition({
          top: rect.top + window.scrollY - 50,
          left: rect.left + window.scrollX + rect.width / 2,
        });
        setShowPopup(true);
      } else if (!showNoteInput) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [containerRef, showNoteInput]);

  const handleSaveHighlight = async () => {
    if (!selectedText) return;
    setSaving(true);
    try {
      const res = await noteService.createNote({
        articleId,
        highlightedText: selectedText,
        noteContent: noteContent.trim(),
        colorTag,
      });

      if (res.success) {
        setShowPopup(false);
        setShowNoteInput(false);
        setNoteContent('');
        setSelectedText('');
        if (window.getSelection) window.getSelection().removeAllRanges();
        if (onNoteCreated) onNoteCreated(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div
      className="fixed z-50 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-150"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className={`p-2 rounded-2xl border-2 theme-accent-border shadow-2xl flex flex-col gap-2 ${
        isNewspaper ? 'bg-[#F3EEE3] text-amber-950 font-serif' : 'bg-white text-slate-900'
      }`}>
        
        {!showNoteInput ? (
          <div className="flex items-center gap-1.5 px-2 py-1">
            <span className="text-xs font-black theme-accent-btn px-2.5 py-0.5 rounded-full border">
              Snippet Selected
            </span>

            {/* Color Tag Selector */}
            <div className="flex items-center gap-1">
              {[
                { id: 'yellow', class: 'bg-amber-400' },
                { id: 'emerald', class: 'bg-emerald-400' },
                { id: 'indigo', class: 'bg-indigo-400' },
                { id: 'purple', class: 'bg-purple-400' },
                { id: 'rose', class: 'bg-rose-400' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorTag(c.id)}
                  className={`w-4 h-4 rounded-full ${c.class} transition-transform ${
                    colorTag === c.id ? 'scale-125 ring-2 ring-amber-900' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>

            <div className="h-4 w-px bg-slate-300" />

            <button
              onClick={() => setShowNoteInput(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl btn-brand-gradient text-white text-xs font-black shadow-md transition-all"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Highlight</span>
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-2 w-72">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider">Add Personal Note</span>
              <button onClick={() => setShowNoteInput(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              autoFocus
              rows={2}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your note or insight here..."
              className={`w-full border-2 rounded-xl p-2.5 text-xs font-bold focus:outline-none transition-colors ${
                isNewspaper
                  ? 'bg-white border-amber-900/30 text-amber-950 placeholder-amber-900/50 font-serif'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:theme-accent-border'
              }`}
            />

            <button
              onClick={handleSaveHighlight}
              disabled={saving}
              className="w-full py-2 rounded-xl btn-brand-gradient text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Note to Hub'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
