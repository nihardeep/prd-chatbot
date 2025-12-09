import React from 'react';
import Slider from '../ui/slider';
import Input from '../ui/input';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('₹', 'Rs.');

export default function PriceRangeSlider({ value, onChange, min = 0, max = 2039410 }) {
  const handleInputChange = (index, amount) => {
    const numeric = Number(amount.toString().replace(/\D/g, '')) || 0;
    const next = [...value];
    next[index] = Math.min(Math.max(numeric, min), max);
    if (index === 0 && next[0] > next[1]) next[0] = next[1];
    if (index === 1 && next[1] < next[0]) next[1] = next[0];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <Slider min={min} max={max} step={1000} values={value} onChange={onChange} />
      <div className="flex gap-3">
        <Input
          value={value[0]}
          onChange={(e) => handleInputChange(0, e.target.value)}
          className="bg-gray-50 text-gray-900 border-gray-200"
        />
        <Input
          value={value[1]}
          onChange={(e) => handleInputChange(1, e.target.value)}
          className="bg-gray-50 text-gray-900 border-gray-200"
        />
      </div>
      <p className="text-sm text-gray-500">
        {formatCurrency(value[0])} - {formatCurrency(value[1])}
      </p>
    </div>
  );
}


