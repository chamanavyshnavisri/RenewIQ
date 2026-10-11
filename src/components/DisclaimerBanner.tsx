import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-200 px-6 lg:px-12 py-3 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-white">Engineering Notice:</strong> GreenSpace AI provides preliminary AI-based planning estimates. Final installation decisions require an on-site assessment by qualified renewable-energy, electrical, and structural professionals.
          </p>
        </div>
        <span className="text-slate-400 whitespace-nowrap shrink-0 font-mono text-[11px]">
          Preliminary Estimates Only
        </span>
      </div>
    </div>
  );
};
