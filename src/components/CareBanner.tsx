import React from 'react';
import { ShieldCheck, AlertCircle, Heart, Phone, ExternalLink } from 'lucide-react';
import { CrisisResource } from '../types';

interface CareBannerProps {
  resources: CrisisResource[];
  onDismiss?: () => void;
}

export const CareBanner: React.FC<CareBannerProps> = ({ resources, onDismiss }) => {
  return (
    <div className="bg-amber-50/95 border-l-4 border-amber-500 p-5 rounded-xl shadow-sm text-slate-800 my-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-amber-900 font-semibold text-base">
          <Heart className="w-5 h-5 text-amber-600 animate-pulse" />
          <span>Support & Immediate Care Resources</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded border border-slate-200"
          >
            Hide Banner
          </button>
        )}
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">
        Manthan is an automated, reflective journaling tool and cannot provide professional support or crisis intervention. If you are experiencing overwhelming distress, pain, or danger, please reach out to trusted professionals:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {resources.map((res) => (
          <div
            key={res.id}
            className="p-3 bg-white rounded-lg border border-amber-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-amber-800 mb-1">
                <span>{res.region}</span>
                <span className="text-emerald-700 font-normal">{res.hours}</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">{res.name}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{res.description}</p>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/70 px-2 py-1 rounded">
                <Phone className="w-3.5 h-3.5" />
                {res.contact}
              </span>

              {res.link && (
                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1"
                >
                  Visit Site <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Static Verified Crisis Directory — Aligned to UN SDG 3 (Target 3.4)
      </div>
    </div>
  );
};
