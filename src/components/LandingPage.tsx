import React from 'react';
import { ShieldCheck, Heart, Lock, BookOpen, AlertTriangle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onSignIn: () => void;
  isLoading: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, isLoading }) => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col justify-between selection:bg-teal-100">
      {/* Header */}
      <header className="border-b border-stone-200 bg-stone-50/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-800 text-stone-50 flex items-center justify-center font-serif font-bold text-xl shadow-xs">
              M
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-stone-900 tracking-tight">Manthan</span>
              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-teal-100/80 text-teal-800 border border-teal-200">
                UN SDG 3.4
              </span>
            </div>
          </div>

          <button
            onClick={onSignIn}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-all shadow-xs active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Private, Server-Authoritative Reflection Companion</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            A quiet space to unpack your mind, reflect gently, and find clarity.
          </h1>

          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Manthan is an interactive reflection journal aligned to UN Sustainable Development Goal 3.4 (Good Health and Well-being). Write freely in conversational dialogue with a thoughtful, non-clinical AI mirror.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onSignIn}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-medium text-base transition-all shadow-md active:scale-98"
            >
              <span>Begin Your Reflection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clear Boundary Card: What Manthan is & What It Is NOT */}
        <div className="mt-16 bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-xl font-serif font-semibold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              Our Principles & Ethical Guardrails
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Transparency, privacy, and non-clinical safety are built into every layer of Manthan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What Manthan IS */}
            <div className="p-5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-3">
              <h3 className="text-sm font-semibold text-teal-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                What Manthan IS
              </h3>
              <ul className="text-xs text-stone-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span><strong>A Private Journaling Mirror:</strong> Helps you articulate personal feelings, recurring thoughts, and daily experiences.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span><strong>Curious & Non-Judgmental:</strong> Asks open-ended questions to deepen your own self-awareness.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span><strong>Self-Contained Synthesis:</strong> Distills your reflection sessions into key themes and personal insights.</span>
                </li>
              </ul>
            </div>

            {/* What Manthan IS NOT */}
            <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-3">
              <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                What Manthan IS NOT
              </h3>
              <ul className="text-xs text-stone-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>NOT a Therapist or Doctor:</strong> Manthan does not evaluate pathology or offer medical diagnosis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>NOT a Crisis Intervention Tool:</strong> If in danger or acute distress, users are immediately guided to verified human crisis hotlines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>NO Prescriptive Advice:</strong> Never recommends or discourages medication or clinical treatments.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Privacy & Architecture Guarantees */}
          <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-stone-50 rounded-lg">
              <Lock className="w-4 h-4 text-stone-600 mx-auto mb-1.5" />
              <h4 className="text-xs font-semibold text-stone-800">Server-Authoritative Data</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Direct browser writes are disabled. Reads are strictly owner-bound.</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <Heart className="w-4 h-4 text-stone-600 mx-auto mb-1.5" />
              <h4 className="text-xs font-semibold text-stone-800">Care Layer Guardrail</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Server-side distress checks surface verified crisis support.</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <BookOpen className="w-4 h-4 text-stone-600 mx-auto mb-1.5" />
              <h4 className="text-xs font-semibold text-stone-800">Full Data Sovereignty</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Export all reflections anytime, or permanently hard-delete all data.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-500 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Manthan Reflection Journal. Dedicated to UN SDG 3 (Target 3.4).</p>
          <p className="text-stone-400">Built with server-verified privacy & resilient Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};
