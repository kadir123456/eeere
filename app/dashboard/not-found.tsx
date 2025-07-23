'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Sayfa Bulunamadı</h1>
        <p className="text-slate-400 mb-8">
          Aradığınız dashboard sayfası mevcut değil.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard"
            className="bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-3 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 neon-glow flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard'a Dön</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="glass px-6 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </button>
        </div>
      </div>
    </div>
  );
}