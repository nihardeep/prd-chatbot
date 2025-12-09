import React from 'react';
import Toggle from '../ui/toggle';

const SORT_OPTIONS = [
  { key: 'best', label: 'Best match' },
  { key: 'reviewed', label: 'Top reviewed' },
  { key: 'price', label: 'Lowest price first' },
  { key: 'distance', label: 'Distance' },
  { key: 'hot', label: 'Hot Deals!' },
];

export default function SortOptions({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {SORT_OPTIONS.map((option) => (
        <Toggle
          key={option.key}
          isActive={value === option.key}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </Toggle>
      ))}
    </div>
  );
}


