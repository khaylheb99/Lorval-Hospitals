import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className = '',
}) => {
  const getInitials = (n: string) => {
    if (!n) return 'PT';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  };

  return (
    <div
      className={`
        relative inline-flex items-center justify-center rounded-full shrink-0 font-semibold tracking-wider
        bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.3)]
        border border-cyan-200/40
        ${sizeClasses[size]}
        ${className}
      `}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
};
