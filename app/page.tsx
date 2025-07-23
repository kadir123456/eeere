'use client';

import { useState, useEffect } from 'react';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import { TrendingUp, Shield, Zap, BarChart3, Play, Users, CheckCircle, Globe, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getSymbolData, connectionStatus } = useBinanceWebSocket();
  const [btcData, setBtcData] = useState<any>(null);

  useEffect(() => {
    // Get real-time BTC data
    const interval = setInterval(() => {
      const btc = getSymbolData('BTCUSDT');
      if (btc) {
        setBtcData(btc);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getSymbolData]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Momentum AI
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
              Özellikler
            </Link>
            <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">
              Fiyatlandırma
            </Link>
            <Link href="/auth/login" className="text-slate-300 hover:text-white transition-colors">
              Giriş Yap
            </Link>
            <Link href="/auth/register" className="bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-2 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 neon-glow">
              Başla
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-white/10">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link href="#features" className="block text-slate-300 hover:text-white transition-colors">
                Özellikler
              </Link>
              <Link href="#pricing" className="block text-slate-300 hover:text-white transition-colors">
                Fiyatlandırma
              </Link>
              <Link href="/auth/login" className="block text-slate-300 hover:text-white transition-colors">
                Giriş Yap
              </Link>
              <Link href="/auth/register" className="block bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-2 rounded-lg text-center">
                Başla
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="trading-grid absolute inset-0 opacity-30"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Akıllı Kripto Trading<br />Otomasyonu
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              EMA stratejilerine dayalı yapay zeka destekli trading botu ile 7/24 otomatik işlem yapın. 
              Binance API güvenliği ile fonlarınızı koruyun.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/register" className="bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 neon-glow">
                <Play className="w-5 h-5 inline mr-2" />
                Ücretsiz Başla
              </Link>
              <Link href="#demo" className="glass px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300">
                <BarChart3 className="w-5 h-5 inline mr-2" />
                Demo İzle
              </Link>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="glass p-6 rounded-xl">
                <div className="text-2xl font-bold text-emerald-400">
                  ${btcData ? parseFloat(btcData.price).toLocaleString() : 'Loading...'}
                </div>
                <div className="text-slate-400">BTC/USDT</div>
                {btcData && (
                  <div className={`text-sm ${parseFloat(btcData.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {parseFloat(btcData.priceChangePercent) >= 0 ? '+' : ''}{parseFloat(btcData.priceChangePercent).toFixed(2)}%
                  </div>
                )}
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">1,247</div>
                <div className="text-slate-400">Aktif Kullanıcı</div>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className={`text-2xl font-bold ${connectionStatus === 'connected' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {connectionStatus === 'connected' ? 'Bağlı' : 'Bağlantı Yok'}
                </div>
                <div className="text-slate-400">Binance Durumu</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden Momentum AI?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Profesyonel traders tarafından test edilmiş stratejiler, güvenli API entegrasyonu ve 7/24 otomatik işlem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-xl hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">EMA Strateji Sistemi</h3>
              <p className="text-slate-400">
                9, 21 ve 50 periyot EMA'lar ile test edilmiş kesişim stratejisi. Yükseliş ve düşüş trendlerinde otomatik pozisyon yönetimi.
              </p>
            </div>

            <div className="glass p-8 rounded-xl hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Güvenli API Entegrasyonu</h3>
              <p className="text-slate-400">
                API anahtarlarınız AES-256 şifreleme ile korunur. Para çekme yetkisi olmadan sadece işlem yetkisi kullanılır.
              </p>
            </div>

            <div className="glass p-8 rounded-xl hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Anlık İşlem Yürütme</h3>
              <p className="text-slate-400">
                WebSocket bağlantısı ile milisaniye gecikme. Fırsat kaçırmayan hızlı sinyal algılama ve işlem açma sistemi.
              </p>
            </div>

            <div className="glass p-8 rounded-xl hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Detaylı Analiz Paneli</h3>
              <p className="text-slate-400">
                Gerçek zamanlı PnL takibi, işlem geçmişi, kazanma oranı ve performans metrikleri ile tam kontrol.
              </p>
            </div>

            <div className="glass p-8 rounded-xl hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Risk Yönetimi</h3>
              <p className="text-slate-400">
                Günlük zarar limiti, pozisyon büyüklüğü kontrolü ve kaldıraç ayarları ile sermayenizi koruyun.
              </p>
            </div>

            <div className="glass p-8 rounded-xl hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Mobil Uyumlu</h3>
              <p className="text-slate-400">
                Telefon, tablet ve masaüstünde mükemmel deneyim. İstediğiniz yerden botunuzu kontrol edin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Basit ve Şeffaf Fiyatlandırma</h2>
            <p className="text-slate-400 text-lg">
              Gizli ücret yok, istediğiniz zaman iptal edebilirsiniz
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass p-8 rounded-xl border border-slate-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Ücretsiz</h3>
                <div className="text-4xl font-bold mb-2">₺0</div>
                <div className="text-slate-400">Her zaman ücretsiz</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  <span>Demo mod ile strateji testi</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  <span>1 adet kripto parite</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  <span>Temel analiz araçları</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  <span>E-posta desteği</span>
                </li>
              </ul>
              
              <Link href="/auth/register" className="w-full block text-center glass px-6 py-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                Ücretsiz Başla
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="glass p-8 rounded-xl border-2 border-gradient-to-r from-blue-500 to-emerald-500 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-emerald-500 px-3 py-1 rounded-full text-sm font-semibold">
                Popüler
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2">₺99</div>
                <div className="text-slate-400">Aylık faturalandırma</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  <span>Sınırsız kripto parite</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  <span>Gerçek zamanlı otomatik işlem</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  <span>Gelişmiş risk yönetimi</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  <span>Backtesting araçları</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  <span>Telegram bildirimleri</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                  <span>Öncelikli destek</span>
                </li>
              </ul>
              
              <Link href="/auth/register?plan=pro" className="w-full block text-center bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-3 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 neon-glow">
                Pro'ya Geç
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Warning */}
      <section className="py-12 px-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border-y border-red-500/20">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-red-400">⚠️ Risk Uyarısı</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Kripto para ticareti önemli riskler içerir ve sermayenizin tamamının kaybına neden olabilir. 
              Geçmiş performans, gelecekteki sonuçların bir göstergesi değildir. Bu araç tarafından yapılan 
              otomatik işlemlerden doğacak hiçbir kâr veya zarardan platformumuz sorumlu değildir. 
              Bu platform bir finansal danışmanlık hizmeti sunmamaktadır. Yatırım kararlarınızın tüm sorumluluğu size aittir.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Momentum AI
              </span>
            </div>
            
            <div className="flex space-x-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Kullanım Şartları</Link>
              <Link href="/support" className="hover:text-white transition-colors">Destek</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-slate-400 text-sm">
            © 2024 Momentum AI. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}