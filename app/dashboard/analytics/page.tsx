'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';

export default function Analytics() {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('pnl');

  const metrics = [
    { 
      label: 'Toplam P&L', 
      value: '+$1,247.83', 
      change: '+15.2%', 
      positive: true,
      description: 'Son 7 gündeki toplam kâr/zarar'
    },
    { 
      label: 'İşlem Sayısı', 
      value: '156', 
      change: '+23', 
      positive: true,
      description: 'Gerçekleştirilen toplam işlem'
    },
    { 
      label: 'Kazanma Oranı', 
      value: '73.1%', 
      change: '+2.4%', 
      positive: true,
      description: 'Kârlı işlemlerin yüzdesi'
    },
    { 
      label: 'Max Drawdown', 
      value: '-8.7%', 
      change: '-1.2%', 
      positive: false,
      description: 'En büyük düşüş oranı'
    },
    { 
      label: 'Ortalama İşlem', 
      value: '+$8.25', 
      change: '+$1.15', 
      positive: true,
      description: 'İşlem başına ortalama kâr'
    },
    { 
      label: 'Sharpe Ratio', 
      value: '2.14', 
      change: '+0.18', 
      positive: true,
      description: 'Risk-getiri oranı'
    }
  ];

  const topPerformers = [
    { pair: 'BTC/USDT', trades: 45, pnl: '+$523.47', winRate: '78%' },
    { pair: 'ETH/USDT', trades: 38, pnl: '+$342.12', winRate: '71%' },
    { pair: 'ADA/USDT', trades: 29, pnl: '+$189.34', winRate: '69%' },
    { pair: 'SOL/USDT', trades: 22, pnl: '+$156.78', winRate: '75%' },
    { pair: 'MATIC/USDT', trades: 18, pnl: '+$98.45', winRate: '67%' },
  ];

  const recentTrades = [
    { 
      id: 1, 
      pair: 'BTC/USDT', 
      side: 'LONG', 
      entry: 43250, 
      exit: 43980, 
      pnl: 127.50, 
      duration: '2h 34m',
      time: '2024-01-15 14:23'
    },
    { 
      id: 2, 
      pair: 'ETH/USDT', 
      side: 'SHORT', 
      entry: 2580, 
      exit: 2545, 
      pnl: 89.25, 
      duration: '1h 18m',
      time: '2024-01-15 12:45'
    },
    { 
      id: 3, 
      pair: 'BTC/USDT', 
      side: 'LONG', 
      entry: 42890, 
      exit: 43150, 
      pnl: 65.80, 
      duration: '45m',
      time: '2024-01-15 11:30'
    },
    { 
      id: 4, 
      pair: 'ETH/USDT', 
      side: 'SHORT', 
      entry: 2610, 
      exit: 2590, 
      pnl: -47.30, 
      duration: '1h 52m',
      time: '2024-01-15 09:15'
    },
    { 
      id: 5, 
      pair: 'ADA/USDT', 
      side: 'LONG', 
      entry: 0.485, 
      exit: 0.492, 
      pnl: 34.60, 
      duration: '3h 12m',
      time: '2024-01-15 08:00'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analizler</h1>
          <p className="text-slate-400 mt-1">Detaylı performans metrikleri ve istatistikler</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="glass px-4 py-2 rounded-lg text-white bg-transparent border border-slate-600 focus:border-blue-500 outline-none"
          >
            <option value="1d" className="bg-slate-800">1 Gün</option>
            <option value="7d" className="bg-slate-800">7 Gün</option>
            <option value="30d" className="bg-slate-800">30 Gün</option>
            <option value="90d" className="bg-slate-800">90 Gün</option>
          </select>
          
          <button className="glass px-4 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Dışa Aktar</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="glass p-6 rounded-xl hover:bg-white/5 transition-all duration-300 group cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-400 text-sm mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-white mb-2">{metric.value}</p>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 text-sm ${
                    metric.positive ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {metric.positive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{metric.change}</span>
                  </div>
                  <span className="text-slate-500 text-xs">bu dönemde</span>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-3 group-hover:text-slate-400 transition-colors">
              {metric.description}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Performans Grafiği</h3>
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="glass px-3 py-1 rounded-lg text-sm text-white bg-transparent border border-slate-600 focus:border-blue-500 outline-none"
            >
              <option value="pnl" className="bg-slate-800">P&L</option>
              <option value="balance" className="bg-slate-800">Bakiye</option>
              <option value="trades" className="bg-slate-800">İşlem Sayısı</option>
            </select>
          </div>
          
          {/* Mock Chart */}
          <div className="h-64 trading-grid rounded-lg p-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-end space-x-2 p-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-500/60 rounded-t"
                  style={{ 
                    height: `${Math.random() * 80 + 20}%`,
                    minWidth: '8px'
                  }}
                />
              ))}
            </div>
            <div className="absolute top-4 left-4">
              <div className="text-2xl font-bold text-emerald-400">+$1,247.83</div>
              <div className="text-sm text-slate-400">Toplam Kâr</div>
            </div>
          </div>
        </div>

        {/* Win Rate Distribution */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Başarı Dağılımı</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Kazanılan İşlemler</span>
              <span className="text-emerald-400 font-medium">114 (73.1%)</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full" style={{ width: '73.1%' }}></div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-slate-300">Kaybedilen İşlemler</span>
              <span className="text-red-400 font-medium">42 (26.9%)</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full" style={{ width: '26.9%' }}></div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="text-emerald-400 font-semibold">Ortalama Kazanç</div>
            <div className="text-2xl font-bold text-white">$18.45</div>
            <div className="text-sm text-slate-400">per winning trade</div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-6">En İyi Performans Gösteren Pariteler</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 text-sm py-3">Parite</th>
                <th className="text-left text-slate-400 text-sm py-3">İşlem Sayısı</th>
                <th className="text-left text-slate-400 text-sm py-3">Toplam P&L</th>
                <th className="text-left text-slate-400 text-sm py-3">Kazanma Oranı</th>
                <th className="text-left text-slate-400 text-sm py-3">Performans</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((item, index) => (
                <tr key={index} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">{item.pair}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-300">{item.trades}</td>
                  <td className="py-4 text-emerald-400 font-medium">{item.pnl}</td>
                  <td className="py-4 text-slate-300">{item.winRate}</td>
                  <td className="py-4">
                    <div className="w-16 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full" 
                        style={{ width: item.winRate }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="glass p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Son İşlemler</h3>
          <button className="glass px-4 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtrele</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 text-sm py-3">Parite</th>
                <th className="text-left text-slate-400 text-sm py-3">Yön</th>
                <th className="text-left text-slate-400 text-sm py-3">Giriş</th>
                <th className="text-left text-slate-400 text-sm py-3">Çıkış</th>
                <th className="text-left text-slate-400 text-sm py-3">P&L</th>
                <th className="text-left text-slate-400 text-sm py-3">Süre</th>
                <th className="text-left text-slate-400 text-sm py-3">Zaman</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((trade) => (
                <tr key={trade.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
                  <td className="py-3 text-white font-medium">{trade.pair}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.side === 'LONG' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">${trade.entry.toLocaleString()}</td>
                  <td className="py-3 text-slate-300">${trade.exit.toLocaleString()}</td>
                  <td className={`py-3 font-medium ${trade.pnl > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </td>
                  <td className="py-3 text-slate-400 text-sm">{trade.duration}</td>
                  <td className="py-3 text-slate-400 text-sm">{trade.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}