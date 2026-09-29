import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-charcoal">{label}</label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray">{icon}</div>}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-md border border-warm-gray/30 bg-white px-3 py-2 text-charcoal placeholder-warm-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-colors',
              icon && 'pl-10',
              error && 'border-error focus:border-error focus:ring-error',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-error">{error}</span>}
        {helperText && !error && <span className="text-xs text-warm-gray">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
