import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('rounded-xl bg-white p-6 shadow-sm border border-warm-gray/10', className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
