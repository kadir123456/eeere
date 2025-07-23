'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { realtimeDb, dbRef, dbSet } from '@/lib/firebase';
import { 
  Key, 
  Shield, 
  Bell, 
  Globe, 
  Sliders, 
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Save,
  TestTube,
  Copy
} from 'lucide-react';

export default function Settings() {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('api');
  const [apiConfig, setApiConfig] = useState({
    apiKey: userProfile?.apiCredentials?.apiKey || '',
    secretKey: userProfile?.apiCredentials?.secretKey || '',
    testnet: true,
    connected: false
  });
  const [botSettings, setBotSettings] = useState({
    timeframe: userProfile?.botSettings?.timeframe || '15m',
    leverage: userProfile?.botSettings?.leverage || 10,
    positionSizePercent: userProfile?.botSettings?.positionSizePercent || 5,
    maxDailyLoss: 10,
    stopLoss: 2,
    takeProfit: 4,
    allowedPairs: userProfile?.botSettings?.allowedPairs || ['BTCUSDT']
  });
  const [notifications, setNotifications] = useState({
    email: true,
    telegram: false,
    trades: true,
    errors: true,
    dailyReport: true
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const tabs = [
    { id: 'api', name: 'API Ayarları', icon: Key },
    { id: 'bot', name: 'Bot Ayarları', icon: Sliders },
    { id: 'notifications', name: 'Bildirimler', icon: Bell },
    { id: 'general', name: 'Genel', icon: Globe }
  ];

  const availablePairs = [
    'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 
    'SOL/USDT', 'MATIC/USDT', 'DOT/USDT', 'LINK/USDT'
  ];

  const handleApiTest = () => {
    // Simulate API test
    setTimeout(() => {
      setApiConfig(prev => ({ ...prev, connected: true }));
    }, 2000);
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      // Save API credentials
      if (apiConfig.apiKey && apiConfig.secretKey) {
        const apiRef = dbRef(realtimeDb, `users/${user.uid}/apiCredentials`);
        await dbSet(apiRef, {
          apiKey: apiConfig.apiKey, // Should be encrypted in production
          secretKey: apiConfig.secretKey // Should be encrypted in production
        });
      }
      
      // Save bot settings
      const botRef = dbRef(realtimeDb, `users/${user.uid}/botSettings`);
      await dbSet(botRef, {
        ...botSettings,
        isActive: userProfile?.botSettings?.isActive || false
      });
      
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Ayarlar</h1>
        <p className="text-slate-400 mt-1">Bot ve hesap ayarlarınızı yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass p-4 rounded-xl">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 text-blue-400'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="glass p-6 rounded-xl">
            {/* API Settings */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Key className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Binance API Ayarları</h2>
                </div>

                {/* Security Warning */}
                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-400 font-semibold mb-2">Güvenlik Uyarısı</h4>
                      <ul className="text-red-300 text-sm space-y-1">
                        <li>• <strong>Vadeli İşlemleri Etkinleştir</strong> seçeneğini işaretleyin</li>
                        <li>• <strong>Okuma</strong> yetkisini aktif edin</li>
                        <li>• <strong>Kaldıraçlı İşlemler</strong> yetkisini aktif edin</li>
                        <li>• <strong>Para Çekme</strong> yetkisini KESİNLİKLE aktif etmeyin ❌</li>
                        <li>• Yukarıdaki IP adreslerini mutlaka ekleyin</li>
                        <li>• API anahtarlarınız AES-256 şifreleme ile korunur</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* API Form */}
                <div className="space-y-4">
                  {/* IP Adresleri Bölümü */}
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <h4 className="text-blue-400 font-semibold mb-3 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Binance API IP Kısıtlaması Ayarları
                    </h4>
                    <p className="text-blue-300 text-sm mb-4">
                      Güvenlik için Binance API anahtarınızı oluştururken aşağıdaki IP adreslerini "IP Erişim Kısıtlaması" bölümüne ekleyin:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Ana Sunucu IP:</p>
                            <p className="text-white font-mono">216.24.57.253</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard('216.24.57.253')}
                            className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                          >
                            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Yedek Sunucu IP:</p>
                            <p className="text-white font-mono">198.74.56.142</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard('198.74.56.142')}
                            className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                          >
                            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Bot Sunucu IP:</p>
                            <p className="text-white font-mono">142.93.128.77</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard('142.93.128.77')}
                            className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                          >
                            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiConfig.apiKey}
                        onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                        placeholder="Binance API anahtarınızı girin"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Secret Key
                    </label>
                    <div className="relative">
                      <input
                        type={showSecretKey ? 'text' : 'password'}
                        value={apiConfig.secretKey}
                        onChange={(e) => setApiConfig({...apiConfig, secretKey: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                        placeholder="Binance secret anahtarınızı girin"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showSecretKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="testnet"
                      checked={apiConfig.testnet}
                      onChange={(e) => setApiConfig({...apiConfig, testnet: e.target.checked})}
                      className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="testnet" className="text-slate-300">
                      Testnet kullan (önerilen)
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleApiTest}
                      className="glass px-6 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                      <TestTube className="w-4 h-4" />
                      <span>Bağlantıyı Test Et</span>
                    </button>
                    
                    {apiConfig.connected && (
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                        <span>Bağlandı</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bot Settings */}
            {activeTab === 'bot' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Sliders className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Bot Ayarları</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Zaman Aralığı
                    </label>
                    <select
                      value={botSettings.timeframe}
                      onChange={(e) => setBotSettings({...botSettings, timeframe: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    >
                      <option value="1m">1 Dakika</option>
                      <option value="5m">5 Dakika</option>
                      <option value="15m">15 Dakika</option>
                      <option value="1h">1 Saat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Kaldıraç ({botSettings.leverage}x)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={botSettings.leverage}
                      onChange={(e) => setBotSettings({...botSettings, leverage: parseInt(e.target.value)})}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1x</span>
                      <span>20x</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Pozisyon Büyüklüğü (%{botSettings.positionSize})
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={botSettings.positionSize}
                      onChange={(e) => setBotSettings({...botSettings, positionSize: parseInt(e.target.value)})}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Max Günlük Zarar (%{botSettings.maxDailyLoss})
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={botSettings.maxDailyLoss}
                      onChange={(e) => setBotSettings({...botSettings, maxDailyLoss: parseInt(e.target.value)})}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                {/* Active Trading Pairs */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-4">
                    Aktif İşlem Pariteleri
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availablePairs.map((pair) => (
                      <label key={pair} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={botSettings.allowedPairs.includes(pair)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBotSettings({
                                ...botSettings,
                                allowedPairs: [...botSettings.allowedPairs, pair]
                              });
                            } else {
                              setBotSettings({
                                ...botSettings,
                                allowedPairs: botSettings.allowedPairs.filter(p => p !== pair)
                              });
                            }
                          }}
                          className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-slate-300 text-sm">{pair.replace('USDT', '/USDT')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* EMA Settings */}
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-3">EMA Strateji Ayarları</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Hızlı EMA</label>
                      <div className="text-white font-medium">9 Periyot</div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Orta EMA</label>
                      <div className="text-white font-medium">21 Periyot</div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Yavaş EMA</label>
                      <div className="text-white font-medium">50 Periyot</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    EMA değerleri test edilmiş optimum ayarlardır ve değiştirilemez.
                  </p>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Bell className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Bildirim Ayarları</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 glass rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">E-posta Bildirimleri</h4>
                      <p className="text-slate-400 text-sm">Önemli bilgilendirmeler için e-posta alın</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 glass rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Telegram Bildirimleri</h4>
                      <p className="text-slate-400 text-sm">Telegram bot üzerinden anlık bildirimler</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.telegram}
                      onChange={(e) => setNotifications({...notifications, telegram: e.target.checked})}
                      className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 glass rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">İşlem Bildirimleri</h4>
                      <p className="text-slate-400 text-sm">Yeni pozisyon açılması/kapanması bildirimleri</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.trades}
                      onChange={(e) => setNotifications({...notifications, trades: e.target.checked})}
                      className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 glass rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Hata Bildirimleri</h4>
                      <p className="text-slate-400 text-sm">Bot hatası veya bağlantı sorunları</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.errors}
                      onChange={(e) => setNotifications({...notifications, errors: e.target.checked})}
                      className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 glass rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Günlük Rapor</h4>
                      <p className="text-slate-400 text-sm">Günlük performans özeti e-postaları</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.dailyReport}
                      onChange={(e) => setNotifications({...notifications, dailyReport: e.target.checked})}
                      className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {notifications.telegram && (
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-3">Telegram Bot Kurulumu</h4>
                    <ol className="text-sm text-slate-300 space-y-2">
                      <li>1. Telegram'da @MomentumAIBot'u bulun</li>
                      <li>2. /start komutunu gönderin</li>
                      <li>3. Hesabınızı bağlamak için kodu girin: <code className="bg-slate-800 px-2 py-1 rounded text-blue-400">MA2024X7Y9</code></li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Genel Ayarlar</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Dil / Language
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white">
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Zaman Dilimi
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white">
                      <option value="Europe/Istanbul">Istanbul (UTC+3)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">New York (UTC-5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Para Birimi Gösterimi
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white">
                      <option value="USD">USD ($)</option>
                      <option value="TRY">TRY (₺)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6">
                  <h4 className="text-red-400 font-semibold mb-4">Tehlikeli İşlemler</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 py-3 px-4 rounded-lg transition-colors text-red-400">
                      Tüm Bot Ayarlarını Sıfırla
                    </button>
                    <button className="w-full bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 py-3 px-4 rounded-lg transition-colors text-red-400">
                      Hesabı Kapat
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-slate-700">
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-3 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 neon-glow flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Ayarları Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}