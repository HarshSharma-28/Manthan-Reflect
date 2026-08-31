import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from './firebaseClient';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { NewReflection } from './components/NewReflection';
import { EntryDetail } from './components/EntryDetail';
import { PrivacyModal } from './components/PrivacyModal';
import { JournalEntry, UserProfile } from './types';
import { LogOut, Sparkles, Shield, User as UserIcon } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [viewState, setViewState] = useState<'dashboard' | 'new-reflection' | 'entry-detail'>('dashboard');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isEntriesLoading, setIsEntriesLoading] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setCurrentUser(user);
          setIdToken(token);
          await syncUserProfile(token);
          await fetchEntries(token);
        } catch (err) {
          console.error('Failed to get token or sync user:', err);
        }
      } else {
        setCurrentUser(null);
        setIdToken(null);
        setProfile(null);
        setEntries([]);
        setViewState('dashboard');
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncUserProfile = async (token: string) => {
    try {
      const res = await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Error syncing user profile:', err);
    }
  };

  const fetchEntries = async (token: string) => {
    try {
      setIsEntriesLoading(true);
      const res = await fetch('/api/entries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch (err) {
      console.error('Failed to fetch entries:', err);
    } finally {
      setIsEntriesLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Sign-in error:', err);
      alert(err.message || 'Sign in failed. Please ensure popups are enabled.');
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const handleOpenEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setViewState('entry-detail');
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!idToken) return;
    try {
      const res = await fetch(`/api/entries/${entryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
        setViewState('dashboard');
        setSelectedEntry(null);
      } else {
        alert('Failed to delete entry');
      }
    } catch (err) {
      console.error('Delete entry failure:', err);
      alert('Delete failed');
    }
  };

  const handleFinishReflection = (newEntry: JournalEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
    setSelectedEntry(newEntry);
    setViewState('entry-detail');
  };

  const handleDataDeleted = () => {
    setEntries([]);
    setSelectedEntry(null);
    setViewState('dashboard');
    handleSignOut();
  };

  // 1. Landing View for unauthenticated users
  if (!currentUser && !isAuthLoading) {
    return <LandingPage onSignIn={handleGoogleSignIn} isLoading={isAuthLoading} />;
  }

  if (isAuthLoading && !currentUser) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-stone-200 border-t-teal-800 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-600 font-medium">Securing session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col selection:bg-teal-100">
      {/* App Header */}
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div
            onClick={() => setViewState('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-800 text-stone-50 flex items-center justify-center font-serif font-bold text-lg shadow-2xs">
              M
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-stone-900 tracking-tight">Manthan</span>
              <span className="ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 hidden sm:inline-block">
                SDG 3.4 Journal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-7 h-7 rounded-full border border-stone-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-xs">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
            )}

            <span className="text-xs font-medium text-stone-700 hidden sm:inline-block max-w-[120px] truncate">
              {currentUser?.displayName || currentUser?.email}
            </span>

            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title="Privacy & Data Sovereignty"
            >
              <Shield className="w-4 h-4" />
            </button>

            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main App Body */}
      <main className="flex-1">
        {viewState === 'dashboard' && (
          <Dashboard
            entries={entries}
            user={profile}
            onNewReflection={() => setViewState('new-reflection')}
            onOpenEntry={handleOpenEntry}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            isLoading={isEntriesLoading}
          />
        )}

        {viewState === 'new-reflection' && idToken && (
          <NewReflection
            idToken={idToken}
            onCancel={() => setViewState('dashboard')}
            onFinishComplete={handleFinishReflection}
          />
        )}

        {viewState === 'entry-detail' && selectedEntry && (
          <EntryDetail
            entry={selectedEntry}
            onBack={() => {
              setViewState('dashboard');
              setSelectedEntry(null);
            }}
            onDelete={handleDeleteEntry}
          />
        )}
      </main>

      {/* Privacy / Data Rights Modal */}
      {idToken && (
        <PrivacyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
          user={profile}
          idToken={idToken}
          onDataDeleted={handleDataDeleted}
        />
      )}
    </div>
  );
}
