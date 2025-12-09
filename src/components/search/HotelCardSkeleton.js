import React from 'react';
import { Skeleton } from '../ui/skeleton';

export default function HotelCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="grid gap-0 lg:grid-cols-[2fr,3fr,1.5fr]">
        {/* Image skeleton */}
        <div className="relative">
          <Skeleton className="h-48 w-full rounded-t-3xl" />
        </div>

        {/* Content skeleton */}
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="w-4 h-4" />
              ))}
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-4 w-32" />

          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        {/* Price skeleton */}
        <div className="p-6 border-l border-white/10 flex flex-col justify-between bg-white/5">
          <div className="text-right space-y-2">
            <Skeleton className="h-6 w-20 ml-auto" />
            <Skeleton className="h-4 w-16 ml-auto" />
            <Skeleton className="h-4 w-24 ml-auto" />
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-8 w-24 ml-auto" />
            <Skeleton className="h-4 w-32 ml-auto" />
          </div>
          <Skeleton className="h-10 w-full mt-6" />
        </div>
      </div>
    </div>
  );
}

