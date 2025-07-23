'use client';

import { useState, useEffect } from 'react';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import { useAuth } from '@/hooks/useAuth';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Target,
  AlertTriangle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { connectionStatus, getSymbolData } = useBinanceWebSocket();
  
  const [portfolio, setPortfolio] = useState({
    balance: 5420.50,
    pnl: 234.75,
    pnlPercent: 4.53,
    openPositions: 2,
    winRate: 87.3
  });

  const [recentTrades, setRecentTrades] = useState([
    { id: 1, pair: 'BTC/USDT', side: 'LONG', entry: 43250, exit: 43980, pnl: 127.50, time: '2 dk önce' },
    { id: 2, pair: 'ETH/USDT', side: 'SHORT', entry: 2580, exit: 2545, pnl: 89.25, time: '15 dk önce' },
    { id: 3, pair: 'BTC/USDT', side: 'LONG', entry: 42890, exit: 43150, pnl: 65.80, time: '32 dk önce' },
    { id: 4, pair: 'ETH/USDT', side: 'SHORT', entry: 2610, exit: 2590, pnl: -47.30, time: '1 sa önce' },
  ]);

  const [botStatus, setBotStatus] = useState(true);
  const [btcData, setBtcData] = useState<any>(null);
  const [ethData, setEthData] = useState<any>(null);

  useEffect(() => {
    // Get real-time data for BTC and ETH
    const interval = setInterval(() => {
      const btc = getSymbolData('BTCUSDT');
      const eth = getSymbolData('ETHUSDT');
      
      if (btc) setBtcData(btc);
      if (eth) setEthData(eth);
      
      // Update portfolio with some realistic simulation
      if (btc) {
        setPortfolio(prev => ({
          ...prev,
          balance: prev.balance + (Math.random() - 0.5) * 10,
          pnl: prev.pnl + (Math.random() - 0.5) * 5,
          pnlPercent: prev.pnlPercent + (Math.random() - 0.5) * 0.1,
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [getSymbolData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Genel Bakış</h1>
          <p className="text-slate-400 mt-1">Trading botunuzun performansını takip edin</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${
            botStatus ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {botStatus ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
            <span>{botStatus ? 'Bot Çalışıyor' : 'Bot Durduruldu'}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${
            connectionStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
            <span>{connectionStatus === 'connected' ? 'Bağlı' : 'Bağlantı Yok'}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Toplam Bakiye</p>
              <p className="text-2xl font-bold text-white">${portfolio.balance.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Günlük P&L</p>
              <p className={`text-2xl font-bold ${portfolio.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${portfolio.pnl.toFixed(2)}
              </p>
              <p className={`text-sm ${portfolio.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {portfolio.pnlPercent >= 0 ? '+' : ''}{portfolio.pnlPercent.toFixed(2)}%
              </p>
            </div>
            <div className={`w-12 h-12 ${portfolio.pnl >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'} rounded-lg flex items-center justify-center`}>
              {portfolio.pnl >= 0 ? 
                <TrendingUp className="w-6 h-6 text-emerald-400" /> : 
                <TrendingDown className="w-6 h-6 text-red-400" />
              }
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Açık Pozisyonlar</p>
              <p className="text-2xl font-bold text-white">{portfolio.openPositions}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Kazanma Oranı</p>
              <p className="text-2xl font-bold text-emerald-400">{portfolio.winRate}%</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
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
          <div className="text-2xl font-bold text-blue-400">
            ${ethData ? parseFloat(ethData.price).toLocaleString() : 'Loading...'}
          </div>
          <div className="text-slate-400">ETH/USDT</div>
          {ethData && (
            <div className={`text-sm ${parseFloat(ethData.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {parseFloat(ethData.priceChangePercent) >= 0 ? '+' : ''}{parseFloat(ethData.priceChangePercent).toFixed(2)}%
            </div>
          )}
        </div>
        <div className="glass p-6 rounded-xl">
          <div className="text-2xl font-bold text-emerald-400">%87.3</div>
          <div className="text-slate-400">Başarı Oranı</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bot Settings Quick Panel */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Bot Ayarları</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Aktif Parite</span>
              <span className="text-white font-medium">
                BTC/USDT {btcData && `($${parseFloat(btcData.price).toLocaleString()})`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Zaman Aralığı</span>
              <span className="text-white font-medium">5m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Kaldıraç</span>
              <span className="text-white font-medium">10x</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Pozisyon Büyüklüğü</span>
              <span className="text-white font-medium">5%</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition-colors">
            Ayarları Düzenle
          </button>
        </div>

        {/* Risk Metrics */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Metrikleri</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Günlük Risk</span>
                <span className="text-white">25%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Max Drawdown</span>
                <span className="text-white">-12.3%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '12.3%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Sharpe Ratio</span>
                <span className="text-emerald-400">2.14</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setBotStatus(!botStatus)}
              className={`w-full py-3 px-4 rounded-lg transition-all ${
                botStatus 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {botStatus ? 'Botu Durdur' : 'Botu Başlat'}
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 py-3 px-4 rounded-lg transition-colors text-white">
              Tüm Pozisyonları Kapat
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg transition-colors text-white">
              Ayarları Yenile
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm">
                {user ? 'Gerçek veriler - Demo mod' : 'Demo modda çalışıyorsunuz'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Son İşlemler</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 text-sm py-3">Parite</th>
                <th className="text-left text-slate-400 text-sm py-3">Yön</th>
                <th className="text-left text-slate-400 text-sm py-3">Giriş</th>
                <th className="text-left text-slate-400 text-sm py-3">Çıkış</th>
                <th className="text-left text-slate-400 text-sm py-3">P&L</th>
                <th className="text-left text-slate-400 text-sm py-3">Zaman</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((trade) => (
                <tr key={trade.id} className="border-b border-slate-800">
                  <td className="py-3 text-white font-medium">{trade.pair}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.side === 'LONG' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">${trade.entry.toLocaleString()}</td>
                  <td className="py-3 text-slate-300">${trade.exit.toLocaleString()}</td>
                  <td className={`py-3 font-medium ${trade.pnl > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </td>
                  <td className="py-3 text-slate-400 text-sm">{trade.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button className="text-blue-400 hover:text-blue-300 transition-colors">
            Tüm İşlemleri Görüntüle →
          </button>
        </div>
      </div>
    </div>
  );
}