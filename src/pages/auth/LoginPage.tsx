import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const action = searchParams.get('action'); // e.g. 'wishlist', 'cart', 'buy_now'
  const productId = searchParams.get('productId');

  const { setAuth } = useAuthStore();
  const { addItem: addCartItem, fetchCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data.data;

      setAuth(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.name}!`);

      // Resume intended action if present
      if (action === 'wishlist' && productId) {
        try {
          await api.post('/wishlist/items', { productId });
          toast.success('Added to your wishlist!');
        } catch {
          // silently handle
        }
      } else if (action === 'cart' && productId) {
        try {
          await addCartItem(productId, 1);
          await fetchCart();
          toast.success('Added to your shopping basket!');
        } catch {
          // silently handle
        }
      }

      // Navigate to intended destination
      if (redirectUrl && redirectUrl !== '/') {
        navigate(redirectUrl, { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'SELLER') {
        navigate('/seller/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-primary/10">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-wider text-secondary-dark uppercase">
            Crafted by Her · Inspired by Odisha
          </span>
          <h2 className="mt-2 text-3xl font-serif font-bold text-primary">
            Welcome to ODCRAFTS
          </h2>
          <p className="mt-2 text-sm text-charcoal-light">
            Sign in to support women artisans and manage your crafts
          </p>

          {redirectUrl !== '/' && (
            <div className="mt-4 p-2.5 rounded-lg bg-secondary-light/30 border border-secondary/30 text-xs text-charcoal text-center">
              Please sign in to continue with your action
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-warm-gray/30 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-charcoal placeholder:text-warm-gray-light transition-colors"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary hover:text-primary-light"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-gray">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-warm-gray/30 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-charcoal placeholder:text-warm-gray-light transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-warm-gray hover:text-charcoal"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-error">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-light transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-warm-gray/10">
          <p className="text-sm text-charcoal-light">
            Don't have an account?{' '}
            <Link
              to={`/register${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
