import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Mail, Phone, Lock, ArrowRight, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[A-Z])/, 'Must include at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Must include at least one number'),
  role: z.enum(['CUSTOMER', 'SELLER']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const redirectUrl = searchParams.get('redirect') || '/';

  const defaultRole = roleParam === 'SELLER' ? 'SELLER' : 'CUSTOMER';
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', data);
      const { user, accessToken, refreshToken } = response.data.data;

      setAuth(user, accessToken, refreshToken);

      if (data.role === 'SELLER') {
        toast.success('Artisan registration successful! Welcome to the ODCRAFTS family.');
        navigate('/seller/profile');
      } else {
        toast.success(`Welcome to ODCRAFTS, ${user?.name || data.name}!`);
        navigate(redirectUrl, { replace: true });
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      toast.error(typeof msg === 'string' ? msg : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-primary/10">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-wider text-secondary-dark uppercase flex items-center justify-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Join Our Community
          </span>
          <h2 className="mt-2 text-3xl font-serif font-bold text-primary">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-charcoal-light">
            {selectedRole === 'SELLER'
              ? 'Join as an artisan partner and share Odisha’s living heritage'
              : 'Discover authentic handmade creations from women artisans'}
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex p-1 bg-ivory-dark rounded-xl border border-warm-gray/20">
          <button
            type="button"
            onClick={() => setValue('role', 'CUSTOMER')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedRole === 'CUSTOMER'
                ? 'bg-white text-primary shadow-xs'
                : 'text-charcoal hover:text-primary'
            }`}
          >
            I am a Customer
          </button>
          <button
            type="button"
            onClick={() => setValue('role', 'SELLER')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedRole === 'SELLER'
                ? 'bg-primary text-white shadow-xs'
                : 'text-charcoal hover:text-primary'
            }`}
          >
            I am a Woman Artisan
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('role')} />

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-gray">
                <User className="h-4 w-4" />
              </div>
              <input
                {...register('name')}
                type="text"
                placeholder={selectedRole === 'SELLER' ? 'e.g. Malati Meher' : 'Your full name'}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-warm-gray/30 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-charcoal placeholder:text-warm-gray-light"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
          </div>

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
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Mobile Number (10 Digits)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-gray">
                <Phone className="h-4 w-4" />
              </div>
              <input
                {...register('phone')}
                type="tel"
                placeholder="9861012345"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-warm-gray/30 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-charcoal placeholder:text-warm-gray-light"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Password (Min 8 chars, 1 uppercase, 1 number)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-gray">
                <Lock className="h-4 w-4" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-warm-gray/30 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-charcoal placeholder:text-warm-gray-light"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-light transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>{selectedRole === 'SELLER' ? 'Register as Artisan Partner' : 'Create Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-warm-gray/10">
          <p className="text-sm text-charcoal-light">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
