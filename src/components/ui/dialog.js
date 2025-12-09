import React from 'react';
import { cn } from '../../lib/utils';

const Dialog = React.forwardRef(function Dialog(
  { className, open, onOpenChange, ...props },
  ref
) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onOpenChange ? () => onOpenChange(false) : undefined}
      />
      {/* Dialog */}
      <div
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          className
        )}
        {...props}
      />
    </>
  );
});

const DialogContent = React.forwardRef(function DialogContent(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-[#1a1530] border border-white/20 rounded-2xl shadow-2xl',
        className
      )}
      {...props}
    />
  );
});

export { Dialog, DialogContent };

