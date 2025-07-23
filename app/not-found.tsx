'use client';

import Link from 'next/link';
import { TrendingUp, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <TrendingUp className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-300 mb-4">Sayfa Bulunamadı</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-3 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 neon-glow flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Ana Sayfaya Dön</span>
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