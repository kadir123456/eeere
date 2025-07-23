'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Settings, 
  CreditCard, 
  Menu, 
  X, 
  Home,
  PlayCircle,
  PauseCircle,
  Bell,
  User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [botStatus, setBotStatus] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Genel Bakış', href: '/dashboard', icon: Home },
    { name: 'Analizler', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
    { name: 'Abonelik', href: '/dashboard/billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navigation */}
      <header className="fixed top-0 right-0 left-0 z-50 glass border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="hidden lg:flex items-center space-x-2 ml-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Momentum AI
              </span>
            </div>
          </div>

          {/* Bot Status Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-300">Bot:</span>
              <button
                onClick={() => setBotStatus(!botStatus)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all ${
                  botStatus 
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                    : 'border-slate-600 bg-slate-800/50 text-slate-400'
                }`}
              >
                {botStatus ? (
                  <>
                    <PauseCircle className="w-4 h-4" />
                    <span className="text-sm">Aktif</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span className="text-sm">Pasif</span>
                  </>
                )}
              </button>
            </div>

            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 z-40 w-64 glass border-r border-white/10 transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 text-blue-400' 
                    : 'hover:bg-white/5 text-slate-300 hover:text-white'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-4 left-4 right-4 glass p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Kullanıcı</div>
              <div className="text-xs text-slate-400">Ücretsiz Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <GlobalNotifications />
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}