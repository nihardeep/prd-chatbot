import React from 'react';
import { cn } from '../../lib/utils';

export default function ScrollArea({ className, children }) {
  return (
    <div className={cn('overflow-y-auto', className)}>{children}</div>
  );
}


