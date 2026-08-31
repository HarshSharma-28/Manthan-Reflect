import React from 'react';
import { JournalEntry, UserProfile } from '../types';
import { Plus, BookOpen, Calendar, Clock, Tag, Heart, Shield, ArrowRight, Sparkles } from 'lucide-react';

interface DashboardProps {
  entries: JournalEntry[];
  user: UserProfile | null;
  onNewReflection: () => void;
  onOpenEntry: (entry: JournalEntry) => void;
  onOpenPrivacy: () => void;
  isLoading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  entries,
  user,
  onNewReflection,
  onOpenEntry,
  onOpenPrivacy,
  isLoading,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-medium border border-teal-100">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>UN SDG 3 (Target 3.4) Good Health & Well-being</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-stone-600 max-w-xl leading-relaxed">
            Your private journal is a safe, confidential sanctuary to process your inner experiences. All entries are preserved with server-authoritative privacy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenPrivacy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium text-xs transition-colors shadow-2xs"
          >
            <Shield className="w-4 h-4 text-stone-600" />
            <span>Privacy & Data Rights</span>
          </button>

          <button
            onClick={onNewReflection}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-medium text-sm transition-all shadow-xs active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>New Reflection</span>
          </button>
        </div>
      </div>

      {/* Entries Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-lg font-serif font-semibold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-700" />
            <span>Past Reflections</span>
            <span className="text-xs font-sans font-normal px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">
              {entries.length}
            </span>
          </h2>
          <span className="text-xs text-stone-400">Ordered newest first</span>
        </div>

        {isLoading ? (
          <div className="text-center py-16 space-y-3">
            <div className="inline-block w-8 h-8 border-3 border-stone-200 border-t-teal-700 rounded-full animate-spin" />
            <p className="text-xs text-stone-500">Loading your private reflections securely...</p>
          </div>
        ) : entries.length === 0 ? (
          /* Empty state for new users */
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto shadow-2xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-serif font-semibold text-stone-900">No reflections written yet</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Take a moment for yourself. Start your first conversational session with Manthan to reflect on what you are feeling today.
              </p>
            </div>
            <button
              onClick={onNewReflection}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-medium text-xs transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Begin First Reflection</span>
            </button>
          </div>
        ) : (
          /* Entries List */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => {
              const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={entry.id}
                  onClick={() => onOpenEntry(entry)}
                  className="group bg-white rounded-xl border border-stone-200 hover:border-teal-300 p-5 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 text-left"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1 text-stone-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDate}
                      </span>
                      {entry.careFlag && (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                          <Heart className="w-3 h-3 text-amber-600" />
                          Care Supported
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-teal-900 line-clamp-1 transition-colors">
                      {entry.title || 'Untitled Reflection'}
                    </h3>

                    {entry.summary ? (
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {entry.summary}
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400 italic">
                        {entry.messages?.length || 0} messages in session
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
                      {entry.themes && entry.themes.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md"
                        >
                          <Tag className="w-2.5 h-2.5 text-stone-400" />
                          {t}
                        </span>
                      ))}
                      {entry.themes && entry.themes.length > 2 && (
                        <span className="text-[11px] text-stone-400 self-center">
                          +{entry.themes.length - 2} more
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-teal-800 font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
