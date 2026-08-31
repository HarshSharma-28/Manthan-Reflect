import React, { useState } from 'react';
import { Download, Trash2, Shield, X, AlertTriangle, Check, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  idToken: string;
  onDataDeleted: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  user,
  idToken,
  onDataDeleted,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/user/export', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) throw new Error('Export request failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manthan-reflections-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Export failed:', err);
      alert('Failed to download data export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (deleteConfirmText !== 'DELETE_MY_ENTRIES_PERMANENTLY') {
      setDeleteError('Confirmation text does not match.');
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      const res = await fetch('/api/user/delete-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          confirmation: 'DELETE_MY_ENTRIES_PERMANENTLY',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Deletion failed');
      }

      alert('All your reflection data and profile have been permanently deleted.');
      onDataDeleted();
      onClose();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2 text-stone-900 font-serif font-semibold text-lg">
            <Shield className="w-5 h-5 text-teal-700" />
            <span>Data Ownership & Privacy Rights</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
          <p>
            In compliance with <strong>UN SDG 3 (Target 3.4)</strong> and strict data sovereignty standards, your reflections belong solely to you. Your data is isolated in secure, server-authoritative Firestore collections.
          </p>

          {/* Export Section */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-stone-900 text-sm">Download Full Data Archive</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Export all entries, dialogue logs, summaries, and themes in standard JSON.</p>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors shrink-0 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export JSON'}</span>
            </button>
          </div>

          {/* Hard Delete Section */}
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 space-y-3">
            <div className="flex items-center gap-2 text-red-900 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Permanent Data Erasure (Hard Delete)</span>
            </div>
            <p className="text-[11px] text-red-800 leading-normal">
              This action removes all your reflection entries, chat histories, and profile documents from Cloud Firestore. This cannot be undone.
            </p>

            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-medium text-stone-700">
                To confirm, type <code className="bg-stone-200 text-stone-800 px-1 py-0.5 rounded font-mono font-bold">DELETE_MY_ENTRIES_PERMANENTLY</code> below:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE_MY_ENTRIES_PERMANENTLY"
                className="w-full text-xs px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono bg-white"
              />
            </div>

            {deleteError && (
              <p className="text-xs text-red-600 font-medium">{deleteError}</p>
            )}

            <button
              onClick={handleDeleteAll}
              disabled={isDeleting || deleteConfirmText !== 'DELETE_MY_ENTRIES_PERMANENTLY'}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Deleting data...' : 'Permanently Erase All My Data'}</span>
            </button>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
