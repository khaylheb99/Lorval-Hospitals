import React from 'react';

interface PulseDotProps {
  color?: 'cyan' | 'emerald' | 'rose' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PulseDot: React.FC<PulseDotProps> = ({
  color = 'cyan',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const pingSizeMap = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const colorMap = {
    cyan: {
      ping: 'bg-cyan-400',
      dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    },
    emerald: {
      ping: 'bg-emerald-400',
      dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
    },
    rose: {
      ping: 'bg-rose-400',
      dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
    },
    amber: {
      ping: 'bg-amber-400',
      dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    },
  };

  const selected = colorMap[color] || colorMap.cyan;

  return (
    <span className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <span
        className={`animate-ping absolute inline-flex rounded-full opacity-75 ${pingSizeMap[size]} ${selected.ping}`}
      />
      <span
        className={`relative inline-flex rounded-full ${sizeMap[size]} ${selected.dot}`}
      />
    </span>
  );
};
