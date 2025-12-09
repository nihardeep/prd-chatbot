import React from 'react';
import { cn } from '../../lib/utils';

export default function Toggle({
  isActive,
  children,
  className,
  onClick,
  variant = 'ghost',
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition',
        isActive
          ? 'bg-[#3b82f6] border-[#3b82f6] text-white shadow-lg'
          : 'border-white/20 text-white hover:bg-white/10',
        className
      )}
      type="button"
    >
      {children}
    </button>
  );
}


