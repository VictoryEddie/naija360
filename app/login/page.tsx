'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#008751]/10 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="h-12 w-12 rounded-xl bg-[#008751] flex items-center justify-center">
              <span className="text-white font-bold text-xl">360</span>
            </div>
            <span className="text-3xl font-bold text-white">
              Naija
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
            Welcome Back
          </h1>
          <p className="text-[#A3A3A3]">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1A1A1A] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 border border-[#2A2A2A]">
          {error && (
            <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-[#EF4444] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#737373]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008751] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] bg-[#0A0A0A] text-white placeholder:text-[#737373] transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#737373]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-[#2A2A2A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008751] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] bg-[#0A0A0A] text-white placeholder:text-[#737373] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#008751] text-white font-semibold rounded-lg hover:bg-[#006B3F] transition-all hover:shadow-[0_4px_12px_rgba(0,135,81,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A2A]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#1A1A1A] text-[#737373]">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 border border-[#2A2A2A] text-white font-medium rounded-lg hover:bg-[#0A0A0A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-[#A3A3A3]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#008751] font-semibold hover:text-[#006B3F] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
