import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'new' | 'handmade' | 'bestseller' | 'limited' | 'featured' | 'success' | 'error';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-warm-gray/10 text-charcoal',
    new: 'bg-accent/10 text-accent-dark',
    handmade: 'bg-primary/10 text-primary-dark',
    bestseller: 'bg-warning/10 text-warning-dark',
    limited: 'bg-secondary/20 text-secondary-dark',
    featured: 'bg-info/10 text-info-dark',
    success: 'bg-success/10 text-success-dark',
    error: 'bg-error/10 text-error-dark',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
