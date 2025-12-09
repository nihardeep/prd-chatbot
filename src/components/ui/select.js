import React from 'react';
import { cn } from '../../lib/utils';

export default function Select({
  className,
  options = [],
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={cn(
          'flex h-11 w-full appearance-none rounded-lg border border-white/20 bg-white/10 px-4 pr-10 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e879f9]',
          className
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="text-[#1a1530]"
          >
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/70">
        ▾
      </span>
    </div>
  );
}


