import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Momentum AI - Akıllı Kripto Trading Otomasyonu',
  description: 'EMA stratejilerine dayalı akıllı kripto trading botu. Binance API entegrasyonu ile güvenli otomasyon.',
  keywords: 'kripto, bitcoin, trading, bot, otomasyon, binance, EMA, momentum',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-slate-900 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}