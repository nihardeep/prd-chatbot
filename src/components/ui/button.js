import React from 'react';
import { cn } from '../../lib/utils';

const baseClasses =
  'inline-flex items-center justify-center rounded-lg text-sm font-semibold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none ring-offset-[#1a1530]';

const variants = {
  primary: 'bg-[#3b82f6] text-white hover:bg-[#2f6ed1]',
  secondary: 'bg-white/10 text-white hover:bg-white/20',
  outline: 'border border-white/40 text-white hover:bg-white/10',
  ghost: 'text-white hover:bg-white/10',
  accent: 'bg-[#ff8b5f] text-[#1a1530] hover:bg-[#ff996f]',
};

const sizes = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-base',
};

const Button = React.forwardRef(function Button(
  { className, variant = 'primary', size = 'md', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

export default Button;


