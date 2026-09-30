import React from 'react';

interface StatBadgeProps {
  icon?: React.ReactNode;
  label: string;
  value?: string | number;
  variant?: 'cyan' | 'slate' | 'emerald';
  className?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  icon,
  label,
  value,
  variant = 'cyan',
  className = '',
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 border-cyan-400/25 text-cyan-200',
    slate: 'bg-slate-800/60 border-slate-700/50 text-slate-300',
    emerald: 'bg-emerald-500/10 border-emerald-400/25 text-emerald-200',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium tracking-wide backdrop-blur-sm ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="text-slate-300">{label}</span>
      {value !== undefined && (
        <span className="font-semibold text-white tabular-nums">{value}</span>
      )}
    </div>
  );
};
