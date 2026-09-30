import React from 'react';
import type { UrgencyLevel } from '../types';
import { PulseDot } from './PulseDot';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel | string;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  urgency,
  className = '',
}) => {
  const normalized = (urgency || 'Normal').trim();

  if (normalized.toLowerCase() === 'high') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)] ${className}`}
      >
        <PulseDot color="rose" size="sm" />
        <span>High Priority</span>
      </span>
    );
  }

  if (normalized.toLowerCase() === 'low') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700/60 text-slate-400 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        <span>Low</span>
      </span>
    );
  }

  // Default: Normal
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      <span>Normal</span>
    </span>
  );
};
