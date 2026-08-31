import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, Sparkles, Heart, RefreshCw, X, ArrowLeft } from 'lucide-react';
import { JournalMessage, JournalEntry, CrisisResource } from '../types';
import { CareBanner } from './CareBanner';
import confetti from 'canvas-confetti';

interface NewReflectionProps {
  idToken: string;
  onCancel: () => void;
  onFinishComplete: (entry: JournalEntry) => void;
}

export const NewReflection: React.FC<NewReflectionProps> = ({
  idToken,
  onCancel,
  onFinishComplete,
}) => {
  const [messages, setMessages] = useState<JournalMessage[]>([
    {
      id: 'initial-prompt',
      sender: 'assistant',
      text: "Welcome to Manthan. Take a deep breath. What is gently resting on your mind today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedLastMessage, setFailedLastMessage] = useState<string | null>(null);
  const [sessionCareFlag, setSessionCareFlag] = useState(false);
  const [crisisResources, setCrisisResources] = useState<CrisisResource[]>([]);
  const [finishError, setFinishError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, isFinishing]);

  const handleSendMessage = async (retryContent?: string) => {
    const textToSend = (retryContent ?? inputText).trim();
    if (!textToSend || isSending) return;

    // Clear error states
    setErrorMessage(null);
    setFailedLastMessage(null);

    const userMessage: JournalMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    if (!retryContent) {
      setInputText('');
    }
    setIsSending(true);

    try {
      const response = await fetch('/api/reflect/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Unable to connect to reflection companion. Please retry.');
      }

      const data = await response.json();
      const assistantMessage: JournalMessage = {
        id: 'msg-resp-' + Date.now(),
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.careFlag) {
        setSessionCareFlag(true);
        if (Array.isArray(data.crisisResources) && data.crisisResources.length > 0) {
          setCrisisResources(data.crisisResources);
        }
      }
    } catch (err: any) {
      console.error('Reflect message failure:', err);
      setErrorMessage(err.message || 'Reflection message failed to send.');
      // Keep message available for one-click retry so input is never lost
      setFailedLastMessage(textToSend);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  const handleFinishReflection = async () => {
    // Need at least one user message
    const userMessages = messages.filter((m) => m.sender === 'user');
    if (userMessages.length === 0) {
      alert('Please write at least one reflection message before finishing.');
      return;
    }

    setIsFinishing(true);
    setFinishError(null);

    try {
      const response = await fetch('/api/reflect/finish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          messages: messages,
          careFlag: sessionCareFlag,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save reflection to your private journal. Please retry.');
      }

      const data = await response.json();
      if (data.success && data.entry) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#0f766e', '#14b8a6', '#f59e0b'],
          });
        } catch (e) {
          // ignore
        }
        onFinishComplete(data.entry);
      } else {
        throw new Error('Incomplete response from reflection server.');
      }
    } catch (err: any) {
      console.error('Finish reflection error:', err);
      setFinishError(err.message || 'Failed to save reflection.');
    } finally {
      setIsFinishing(false);
    }
  };

  const hasUserWritten = messages.some((m) => m.sender === 'user');

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex items-center justify-between shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            title="Cancel & Return"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-serif font-semibold text-base text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Active Reflection Session</span>
            </h2>
            <p className="text-xs text-stone-500">Non-clinical, reflective dialogue aligned to UN SDG 3.4</p>
          </div>
        </div>

        <button
          onClick={handleFinishReflection}
          disabled={!hasUserWritten || isFinishing || isSending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-medium text-xs transition-all shadow-xs active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFinishing ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing & Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-teal-200" />
              <span>Finish & Save Reflection</span>
            </>
          )}
        </button>
      </div>

      {/* Distress Care Banner if Care Flag Triggered */}
      {sessionCareFlag && crisisResources.length > 0 && (
        <CareBanner resources={crisisResources} />
      )}

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto bg-stone-50/50 rounded-2xl border border-stone-200 p-4 sm:p-6 space-y-4 shadow-inner mb-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-1 px-1">
                <span>{isUser ? 'You' : 'Manthan Reflection Companion'}</span>
              </div>
              <div
                className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-800 text-white rounded-br-xs shadow-2xs'
                    : 'bg-white text-stone-800 rounded-bl-xs border border-stone-200 shadow-2xs whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-stone-500 bg-white border border-stone-200 px-4 py-2.5 rounded-2xl rounded-bl-xs w-fit shadow-2xs">
            <span className="w-3 h-3 border-2 border-teal-600/30 border-t-teal-700 rounded-full animate-spin" />
            <span className="italic">Reflecting with care...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error & Retry Alert (Zero Silent Failures Guarantee) */}
      {errorMessage && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {failedLastMessage && (
            <button
              onClick={() => handleSendMessage(failedLastMessage)}
              className="inline-flex items-center gap-1 font-semibold text-red-800 hover:text-red-950 underline ml-3"
            >
              <RefreshCw className="w-3 h-3" /> Retry Message
            </button>
          )}
        </div>
      )}

      {finishError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{finishError}</span>
          </div>
          <button
            onClick={handleFinishReflection}
            className="inline-flex items-center gap-1 font-semibold text-red-800 hover:text-red-950 underline ml-3"
          >
            <RefreshCw className="w-3 h-3" /> Retry Save
          </button>
        </div>
      )}

      {/* Input Composer */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-sm shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your thoughts freely... (Press Enter to send, Shift+Enter for newline)"
            className="flex-1 resize-none bg-transparent border-0 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none px-2 py-1 leading-relaxed"
            disabled={isSending || isFinishing}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending || isFinishing}
            className="p-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-2xs"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-1.5 px-2 flex items-center justify-between text-[11px] text-stone-400">
          <span>Encrypted in transit & persisted via server-authoritative Firebase Admin.</span>
          <span>Never clinical advice.</span>
        </div>
      </div>
    </div>
  );
};
