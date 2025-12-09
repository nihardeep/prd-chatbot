import React from 'react';
import { cn } from '../../lib/utils';

export default function Checkbox({ label, description, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border border-gray-400"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-gray-900">
        <span className="font-medium text-gray-900">{label}</span>
        {description && (
          <span className={cn('block text-xs text-gray-500')}>{description}</span>
        )}
      </span>
    </label>
  );
}


