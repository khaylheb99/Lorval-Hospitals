import React from 'react';

export const SkeletonRow: React.FC = () => {
  return (
    <tr className="border-b border-cyan-500/10 animate-pulse">
      {/* Patient */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cyan-900/30 border border-cyan-500/20" />
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-cyan-900/40 rounded" />
            <div className="h-3 w-16 bg-cyan-950/60 rounded" />
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-5 py-4">
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 bg-cyan-900/30 rounded" />
          <div className="h-3 w-32 bg-cyan-950/50 rounded" />
        </div>
      </td>

      {/* Appointment Type */}
      <td className="px-5 py-4">
        <div className="h-6 w-32 bg-cyan-900/30 rounded-md" />
      </td>

      {/* Preferred */}
      <td className="px-5 py-4">
        <div className="space-y-1">
          <div className="h-3.5 w-20 bg-cyan-900/30 rounded" />
          <div className="h-3 w-28 bg-cyan-950/40 rounded" />
        </div>
      </td>

      {/* Urgency */}
      <td className="px-5 py-4">
        <div className="h-6 w-20 bg-cyan-900/30 rounded-full" />
      </td>

      {/* Waitlist Date */}
      <td className="px-5 py-4">
        <div className="h-4 w-24 bg-cyan-900/30 rounded" />
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <div className="h-6 w-16 bg-cyan-900/30 rounded-md" />
      </td>
    </tr>
  );
};
