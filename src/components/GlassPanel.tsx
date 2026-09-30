import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
  glow?: boolean;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  elevated = false,
  glow = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        backdrop-blur-md rounded-2xl transition-all duration-200
        ${elevated ? 'bg-[#142A47]/90' : 'bg-[#0F1F35]/80'}
        border border-[rgba(56,189,248,0.15)]
        ${glow ? 'shadow-[0_0_24px_rgba(34,211,238,0.15)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
