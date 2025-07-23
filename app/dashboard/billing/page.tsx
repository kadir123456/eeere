'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  CreditCard, 
  Check, 
  Crown, 
  Calendar,
  Download,
  AlertCircle,
  AlertTriangle,
  Star,
  Copy,
  CheckCircle
} from 'lucide-react';

export default function Billing() {
  const { user, userProfile } = useAuth();
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentAddress, setPaymentAddress] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('none');
  const [txHash, setTxHash] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentAddress(data.paymentAddress);
        setPaymentAmount(data.amount);
        setPaymentId(data.paymentId);
        setPaymentStatus('pending');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
    setLoading(false);
  };

  const handleSubmitTx = async () => {
    if (!txHash.trim()) {
      alert('Lütfen işlem hash\'ini girin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payment/submit-tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.uid,
          txHash: txHash.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentStatus('submitted');
        alert('İşlem hash\'i gönderildi! Admin onayı bekleniyor.');
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Hata oluştu, tekrar deneyin.');
    }
    setLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  const plans = [
    {
      name: 'Ücretsiz',
      id: 'free',
      price: { monthly: 0, yearly: 0 },
      description: 'Başlangıç için ideal',
      features: [
        'Demo mod ile strateji testi',
        '1 adet kripto parite',
        'Temel analiz araçları',
        'E-posta desteği',
        'Günlük 10 işlem limiti'
      ],
      limitations: [
        'Gerçek para ile işlem yapılamaz',
        'Sınırlı parite desteği',
        'Temel özellikler'
      ]
    },
    {
      name: 'Pro',
      id: 'pro',
      price: { monthly: 99, yearly: 950 },
      description: 'Profesyonel traders için',
      popular: true,
      features: [
        'Sınırsız kripto parite',
        'Gerçek zamanlı otomatik işlem',
        'Gelişmiş risk yönetimi',
        'Backtesting araçları',
        'Telegram bildirimleri',
        'Öncelikli destek',
        'AI duygu analizi',
        'Özel strateji geliştirme'
      ],
      limitations: []
    }
  ];

  const billingHistory = [
    {
      id: 1,
      date: '2024-01-01',
      description: 'Pro Plan - Aylık',
      amount: 99,
      status: 'paid',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      date: '2023-12-01',
      description: 'Pro Plan - Aylık',
      amount: 99,
      status: 'paid',
      invoice: 'INV-2023-012'
    },
    {
      id: 3,
      date: '2023-11-01',
      description: 'Pro Plan - Aylık',
      amount: 99,
      status: 'paid',
      invoice: 'INV-2023-011'
    }
  ];


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Abonelik ve Faturalama</h1>
        <p className="text-slate-400 mt-1">Planınızı yönetin ve fatura geçmişinizi görüntüleyin</p>
      </div>

      {/* Payment Modal */}
      {(paymentStatus === 'pending' || paymentStatus === 'submitted') && paymentAddress && (
        <div className="glass p-6 rounded-xl border-2 border-blue-500/30">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Pro Plan Ödemesi</h3>
            <p className="text-slate-400">
              {paymentStatus === 'pending' 
                ? `Aşağıdaki sabit adrese tam olarak ${paymentAmount} USDT gönderin`
                : 'İşlem hash\'i gönderildi. Admin onayı bekleniyor...'
              }
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-400 mb-1">Sabit TRC20 USDT Adresi:</p>
                <p className="text-white font-mono text-sm break-all">{paymentAddress}</p>
              </div>
              <button
                onClick={() => copyToClipboard(paymentAddress)}
                className="ml-3 p-2 glass rounded-lg hover:bg-white/10 transition-colors"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {paymentStatus === 'pending' && (
            <>
              <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-300 text-sm">
                    <p className="font-semibold mb-2">Önemli Uyarılar:</p>
                    <ul className="space-y-1">
                      <li>• Sadece TRC20 ağından USDT gönderin</li>
                      <li>• Tam olarak {paymentAmount} USDT gönderin</li>
                      <li>• Bu sabit adresimizdir, güvenle kullanabilirsiniz</li>
                      <li>• Ödeme sonrası işlem hash'ini aşağıya girin</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    İşlem Hash'i (Transaction Hash)
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Ödeme yaptıktan sonra işlem hash'ini buraya girin"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                </div>
                
                <button
                  onClick={handleSubmitTx}
                  disabled={loading || !txHash.trim()}
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Gönderiliyor...' : 'İşlem Hash\'ini Gönder'}
                </button>
              </div>
            </>
          )}
          
          {paymentStatus === 'submitted' && (
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h4 className="text-blue-400 font-semibold mb-2">İşlem Hash'i Alındı</h4>
                <p className="text-blue-300 text-sm">
                  Ödemeniz admin tarafından kontrol ediliyor. Onaylandığında Pro özellikleri aktif olacak.
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Ödeme ID: {paymentId}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Current Plan Status */}
      <div className="glass p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Mevcut Planınız</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentPlan === 'pro' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-slate-700 text-slate-300'
          }`}>
            {currentPlan === 'pro' ? 'Pro Plan' : 'Ücretsiz Plan'}
          </div>
        </div>

        {currentPlan === 'pro' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-emerald-400">₺99/ay</div>
              <div className="text-slate-400">Sonraki fatura: 15 Şubat 2024</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-white">2,847</div>
              <div className="text-slate-400">Bu ay gerçekleştirilen işlem</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-emerald-400">+₺1,247</div>
              <div className="text-slate-400">Bu ay toplam kâr</div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Demo Moddasınız</h4>
                <p className="text-blue-300 text-sm mb-3">
                  Gerçek para ile işlem yapmak ve tüm özelliklere erişim için Pro plana geçin.
                </p>
                <button
                  onClick={() => handleUpgrade('pro')}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-2 rounded-lg text-sm hover:from-blue-700 hover:to-emerald-700 transition-all duration-300"
                >
                  Pro Plana Geç
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="glass p-1 rounded-xl">
          <div className="flex space-x-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yıllık
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                %20 İndirim
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`glass p-8 rounded-xl relative border-2 transition-all ${
              plan.popular
                ? 'border-gradient-to-r from-blue-500 to-emerald-500'
                : currentPlan === plan.id
                ? 'border-emerald-500/50'
                : 'border-transparent hover:border-slate-600'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>En Popüler</span>
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-2">
                <span className="text-white">₺{plan.price[billingCycle]}</span>
                {plan.price[billingCycle] > 0 && (
                  <span className="text-lg text-slate-400">
                    /{billingCycle === 'monthly' ? 'ay' : 'yıl'}
                  </span>
                )}
              </div>
              <p className="text-slate-400">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            {currentPlan === plan.id ? (
              <div className="w-full bg-emerald-600/20 border border-emerald-500/30 py-3 px-6 rounded-lg text-center text-emerald-400 font-semibold">
                Mevcut Planınız
              </div>
            ) : (
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 neon-glow'
                    : 'glass hover:bg-white/10'
                } disabled:opacity-50`}
              >
                {loading ? 'İşleniyor...' : (plan.id === 'free' ? 'Geçiş Yap' : 'Pro Plana Geç')}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment Method */}
      {currentPlan === 'pro' && (
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Ödeme Yöntemi</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-medium">•••• •••• •••• 4242</div>
              <div className="text-slate-400 text-sm">Son kullanma: 12/26</div>
            </div>
            <button className="ml-auto text-blue-400 hover:text-blue-300 transition-colors">
              Güncelle
            </button>
          </div>
        </div>
      )}

      {/* Billing History */}
      <div className="glass p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Fatura Geçmişi</h3>
          <button className="glass px-4 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Tümünü İndir</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 text-sm py-3">Tarih</th>
                <th className="text-left text-slate-400 text-sm py-3">Açıklama</th>
                <th className="text-left text-slate-400 text-sm py-3">Tutar</th>
                <th className="text-left text-slate-400 text-sm py-3">Durum</th>
                <th className="text-left text-slate-400 text-sm py-3">Fatura</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
                  <td className="py-4 text-slate-300">
                    {new Date(item.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="py-4 text-white">{item.description}</td>
                  <td className="py-4 text-white font-medium">₺{item.amount}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-medium">
                      Ödendi
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                      {item.invoice}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-300">Bu Ay İşlem</h4>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white">2,847</div>
          <div className="text-sm text-slate-400">Sınırsız kullanım</div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-300">API Çağrıları</h4>
            <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-white">15,234</div>
          <div className="text-sm text-slate-400">Bu ay</div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-300">Aktif Süre</h4>
            <div className="w-5 h-5 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-white">24/7</div>
          <div className="text-sm text-slate-400">Kesintisiz</div>
        </div>
      </div>
    </div>
  );
}
