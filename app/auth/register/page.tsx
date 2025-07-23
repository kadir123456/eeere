'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, TrendingUp, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planFromUrl = searchParams?.get('plan');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(planFromUrl || 'free');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const { user, error } = await signUp(formData.email, formData.password);
    
    if (user) {
      router.push('/dashboard');
    } else {
      setError(error || 'Kayıt olunamadı');
    }
    
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    
    const { user, error } = await signInWithGoogle();
    
    if (user) {
      router.push('/dashboard');
    } else {
      setError(error || 'Google ile kayıt olunamadı');
    }
    
    setLoading(false);
  };

  const handleDemoRegister = () => {
    setLoading(true);
    // Demo register - redirect to dashboard without authentication
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          <p className="text-slate-400 mt-2">Hesap oluşturun ve başlayın</p>
        </div>

        {/* Plan Selection */}
        <div className="glass p-4 rounded-2xl mb-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Plan Seçimi</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedPlan('free')}
              className={`p-3 rounded-lg border transition-all ${
                selectedPlan === 'free'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-sm font-semibold">Ücretsiz</div>
              <div className="text-xs text-slate-400">₺0/ay</div>
            </button>
            <button
              onClick={() => setSelectedPlan('pro')}
              className={`p-3 rounded-lg border transition-all relative ${
                selectedPlan === 'pro'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-sm font-semibold">Pro</div>
              <div className="text-xs text-slate-400">₺99/ay</div>
              {selectedPlan === 'pro' && (
                <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <div className="glass p-8 rounded-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-400"
                  placeholder="Adınız ve soyadınız"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-400"
                  placeholder="En az 8 karakter"
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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-400"
                  placeholder="Şifrenizi tekrar girin"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start">
                <input 
                  type="checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500 mt-1 mr-3 flex-shrink-0" 
                />
                <span className="text-sm text-slate-300 leading-relaxed">
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300">Kullanım Şartları</Link> ve{' '}
                  <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Gizlilik Politikası</Link>'nı kabul ediyorum.
                </span>
              </label>
              
              <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
                <p className="text-xs text-red-300 leading-relaxed">
                  <strong>⚠️ Risk Uyarısı:</strong> Kripto para ticareti önemli riskler içerir. 
                  Bu platform finansal danışmanlık hizmeti vermez. Otomatik işlemlerden doğacak 
                  her türlü kâr veya zararın sorumluluğu tamamen size aittir.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Hesap Oluşturuluyor...
                </div>
              ) : (
                `Hesap Oluştur ${selectedPlan === 'pro' ? '(Pro)' : '(Ücretsiz)'}`
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Zaten hesabınız var mı?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Giriş Yap
              </Link>
            </p>
          </div>

          {/* Social Registration */}
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
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full mt-4 glass py-3 rounded-lg font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile Kayıt Ol
            </button>
            
            <button 
              type="button"
              onClick={handleDemoRegister}
              disabled={loading}
              className="w-full mt-2 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
            >
              Demo Hesap Oluştur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}