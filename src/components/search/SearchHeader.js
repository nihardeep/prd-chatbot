import React from 'react';
import Input from '../ui/input';
import Select from '../ui/select';
import Button from '../ui/button';

const guestOptions = [
  { value: '2-adults', label: '2 adults, 1 room' },
  { value: '3-adults', label: '3 adults, 2 rooms' },
  { value: 'family', label: 'Family Suite' },
];

export default function SearchHeader({ searchParams, onUpdate, onSearch }) {
  return (
    <div className="bg-[#1a1530] text-white border-b border-white/10 sticky top-16 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            TravelMate Search
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Plan your stay in Kuala Lumpur
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-white/70">
              Location
            </label>
            <div className="mt-2 space-y-1">
              <Input
                value={searchParams.location}
                onChange={(e) => onUpdate({ location: e.target.value })}
              />
              <p className="text-xs text-white/60">9,778 choices</p>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-white/70">
              Check-in
            </label>
            <div className="mt-2">
              <Input
                value={searchParams.checkIn}
                onChange={(e) => onUpdate({ checkIn: e.target.value })}
              />
              <p className="text-xs text-white/60 mt-1">Thursday</p>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-white/70">
              Check-out
            </label>
            <div className="mt-2">
              <Input
                value={searchParams.checkOut}
                onChange={(e) => onUpdate({ checkOut: e.target.value })}
              />
              <p className="text-xs text-white/60 mt-1">Saturday</p>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-white/70">
              Guests & Rooms
            </label>
            <div className="mt-2">
              <Select
                value={searchParams.guests}
                onChange={(e) => onUpdate({ guests: e.target.value })}
                options={guestOptions}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/70">
            Showing stays in Kuala Lumpur for 27 Nov - 29 Nov 2025
          </p>
          <Button
            className="w-full sm:w-auto"
            variant="primary"
            size="lg"
            onClick={onSearch}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}


