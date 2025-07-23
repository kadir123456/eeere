'use client';

import { useEffect } from 'react';
import { TrendingUp, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <TrendingUp className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Bir Hata Oluştu</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenilemeyi deneyin.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-3 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 neon-glow flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Tekrar Dene</span>
          </button>
          
          <Link 
            href="/"
            className="glass px-6 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>
    </div>
  );
}