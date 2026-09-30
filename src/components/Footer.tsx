import React from 'react';
import { Plus, Shield, Activity, Clock } from 'lucide-react';
import { Link } from '../lib/router';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[rgba(56,189,248,0.12)] bg-[#0A1628]/95 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_12px_rgba(34,211,238,0.3)]">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white tracking-wide">
                Lorval Hospitals Command Center
              </p>
              <p className="text-xs text-slate-400">
                Automated clinical queue triage and slot allocation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-cyan-300/90">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Webhook Synchronization</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">&middot;</span>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Patient Privacy Compliant</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">&middot;</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>24/7 Slot Routing Engine</span>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Lorval Healthcare Systems. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
