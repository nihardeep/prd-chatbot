import React from 'react';
import { Skeleton } from './ui/skeleton';

export default function ChatMessageSkeleton() {
  return (
    <div className="p-3 rounded-lg text-sm bg-gray-100 text-gray-900 mr-auto max-w-xs">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

