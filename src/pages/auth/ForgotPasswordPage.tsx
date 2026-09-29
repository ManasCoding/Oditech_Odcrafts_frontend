import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    // Simulate or call backend password reset endpoint
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success(`Instructions sent to ${data.email}`);
    }, 1000);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-primary/10">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-primary">Reset Password</h2>
          <p className="mt-2 text-sm text-charcoal-light">
            Enter your registered email address and we'll send you recovery instructions.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal">Check your email</h3>
            <p className="text-sm text-charcoal-light">
              We've dispatched password recovery details to your email if an account is registered.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Return to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-gray">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-warm-gray/30 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-charcoal placeholder:text-warm-gray-light"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-error">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-light transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Send Recovery Link'
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-gray hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
