import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children }) {
  return (
    <div className={cn('rounded-2xl bg-white shadow-lg', className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}


