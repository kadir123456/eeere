'use client';

import { useEffect, useState, useCallback } from 'react';
import { getBinanceWebSocket, BinanceTickerData } from '@/lib/binance-websocket';

export function useBinanceWebSocket() {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [tickerData, setTickerData] = useState<Map<string, BinanceTickerData>>(new Map());

  useEffect(() => {
    const ws = getBinanceWebSocket();
    if (!ws) return;

    // Subscribe to connection status
    const unsubscribeConnection = ws.subscribeToConnection((data) => {
      setConnectionStatus(data.status);
    });

    // Subscribe to all ticker updates
    const unsubscribeAll = ws.subscribeToAll((data: BinanceTickerData) => {
      setTickerData(prev => {
        const newMap = new Map(prev);
        newMap.set(data.symbol, data);
        return newMap;
      });
    });

    return () => {
      unsubscribeConnection();
      unsubscribeAll();
    };
  }, []);

  const getSymbolData = useCallback((symbol: string): BinanceTickerData | null => {
    return tickerData.get(symbol) || null;
  }, [tickerData]);

  const subscribeToSymbol = useCallback((symbol: string, callback: (data: BinanceTickerData) => void) => {
    const ws = getBinanceWebSocket();
    return ws?.subscribeToSymbol(symbol, callback);
  }, []);

  return {
    connectionStatus,
    tickerData: Array.from(tickerData.values()),
    getSymbolData,
    subscribeToSymbol
  };
}