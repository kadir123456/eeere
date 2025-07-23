'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, TrendingUp, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { user, error } = await signIn(email, password);
    
    if (user) {
      router.push('/dashboard');
    } else {
      setError(error || 'Giriş yapılamadı');
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    const { user, error } = await signInWithGoogle();
    
    if (user) {
      router.push('/dashboard');
    } else {
      setError(error || 'Google ile giriş yapılamadı');
    }
    
    setLoading(false);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    // Demo login - redirect to dashboard without authentication
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ana Sayfaya Dön
        </Link>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Momentum AI
          </h1>
          <p className="text-slate-400 mt-2">Hesabınıza giriş yapın</p>
        </div>

        {/* Login Form */}
        <div className="glass p-8 rounded-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-400"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-slate-300">Beni hatırla</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Şifremi Unuttum
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Giriş Yapılıyor...
                </div>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Hesabınız yok mu?{' '}
              <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                Kayıt Ol
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">veya</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mt-4 glass py-3 rounded-lg font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile Giriş Yap
            </button>
            
            <button 
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full mt-2 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
            >
              Demo Hesap ile Giriş
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}