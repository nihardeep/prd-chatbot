import React from 'react';
import { cn } from '../../lib/utils';

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  values = [0, 100],
  onChange,
  className,
}) {
  const handleChange = (index, value) => {
    const next = [...values];
    next[index] = Number(value);
    if (index === 0 && next[0] > next[1]) {
      next[0] = next[1];
    }
    if (index === 1 && next[1] < next[0]) {
      next[1] = next[0];
    }
    onChange(next);
  };

  const progressPercent =
    ((values[0] - min) / (max - min)) * 100 +
    (((values[1] - min) / (max - min)) * 100 -
      ((values[0] - min) / (max - min)) * 100) /
      2;

  return (
    <div className={cn('relative py-3', className)}>
      <div className="h-1 rounded-full bg-gray-200">
        <div
          className="absolute h-1 rounded-full bg-[#3b82f6]"
          style={{
            left: `${((values[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((values[1] - min) / (max - min)) * 100}%`,
          }}
        />
      </div>
      {[0, 1].map((index) => (
        <input
          key={index}
          type="range"
          min={min}
          max={max}
          step={step}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          className="absolute -top-1 h-1 w-full bg-transparent appearance-none pointer-events-auto"
          style={{ zIndex: index === 0 ? 30 : 40 }}
        />
      ))}
    </div>
  );
}


