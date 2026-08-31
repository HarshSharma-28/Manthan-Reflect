import React from 'react';
import { JournalEntry } from '../types';
import { Calendar, Clock, Tag, Heart, ArrowLeft, Trash2, ShieldCheck } from 'lucide-react';

interface EntryDetailProps {
  entry: JournalEntry;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export const EntryDetail: React.FC<EntryDetailProps> = ({ entry, onBack, onDelete }) => {
  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(entry.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg bg-white border border-stone-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reflections</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this reflection?')) {
              onDelete(entry.id);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Entry</span>
        </button>
      </div>

      {/* Entry Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded-full text-stone-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1 bg-stone-50 px-2 py-1 rounded-md text-stone-500">
            <Clock className="w-3.5 h-3.5" />
            {formattedTime}
          </span>
          {entry.careFlag && (
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium">
              <Heart className="w-3.5 h-3.5 text-amber-600" />
              Care Supported
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          {entry.title || 'Untitled Reflection'}
        </h1>

        {/* Themes tags */}
        {entry.themes && entry.themes.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {entry.themes.map((theme, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-100"
              >
                <Tag className="w-3 h-3 text-teal-600" />
                {theme}
              </span>
            ))}
          </div>
        )}

        {/* Reflection Summary Block */}
        {entry.summary && (
          <div className="mt-4 p-4 rounded-xl bg-stone-50/90 border-l-3 border-teal-700 text-stone-700 text-sm leading-relaxed">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-900 mb-1">
              Synthesized Takeaway
            </h4>
            <p>{entry.summary}</p>
          </div>
        )}
      </div>

      {/* Dialogue Stream */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-serif font-semibold text-stone-900 border-b border-stone-100 pb-3 flex items-center justify-between">
          <span>Complete Reflection Session</span>
          <span className="text-xs font-sans font-normal text-stone-400">Read-Only Archive</span>
        </h3>

        <div className="space-y-4">
          {entry.messages && entry.messages.length > 0 ? (
            entry.messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[11px] text-stone-400 mb-1 px-1">
                    {isUser ? 'You' : 'Manthan Companion'}
                  </span>
                  <div
                    className={`max-w-2xl px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-teal-800 text-white rounded-br-xs shadow-2xs'
                        : 'bg-stone-100 text-stone-800 rounded-bl-xs border border-stone-200/80 whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-stone-500 italic">No message history preserved for this entry.</p>
          )}
        </div>
      </div>

      {/* Ethical note */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-teal-700" />
        <span>Stored securely with server-authoritative privacy. Aligned with UN SDG 3 (Target 3.4).</span>
      </div>
    </div>
  );
};
