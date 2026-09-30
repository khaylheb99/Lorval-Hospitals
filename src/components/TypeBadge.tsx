import React from 'react';

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className = '' }) => {
  const t = (type || '').toLowerCase();

  let styles = 'bg-cyan-500/10 border-cyan-400/25 text-cyan-300';

  if (t.includes('follow')) {
    styles = 'bg-sky-500/10 border-sky-400/30 text-sky-300';
  } else if (t.includes('dental')) {
    styles = 'bg-violet-500/10 border-violet-400/30 text-violet-300';
  } else if (t.includes('specialist')) {
    styles = 'bg-amber-500/10 border-amber-400/30 text-amber-300';
  } else if (t.includes('general')) {
    styles = 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-medium tracking-tight whitespace-nowrap ${styles} ${className}`}
    >
      {type || 'General Consultation'}
    </span>
  );
};
