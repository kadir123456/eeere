'use client';

export interface BinanceTickerData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  high: string;
  low: string;
}

export interface BinanceKlineData {
  symbol: string;
  openTime: number;
  closeTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // Binance WebSocket Stream URL
      this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      
      this.ws.onopen = () => {
        console.log('Binance WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifySubscribers('connection', { status: 'connected' });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle ticker array data
          if (Array.isArray(data)) {
            data.forEach((ticker: any) => {
              const tickerData: BinanceTickerData = {
                symbol: ticker.s,
                price: ticker.c,
                priceChange: ticker.P,
                priceChangePercent: ticker.P,
                volume: ticker.v,
                high: ticker.h,
                low: ticker.l
              };
              
              this.notifySubscribers(`ticker_${ticker.s}`, tickerData);
              this.notifySubscribers('ticker_all', tickerData);
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Binance WebSocket disconnected');
        this.isConnected = false;
        this.notifySubscribers('connection', { status: 'disconnected' });
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('Binance WebSocket error:', error);
        this.notifySubscribers('connection', { status: 'error', error });
      };

    } catch (error) {
      console.error('Failed to connect to Binance WebSocket:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.notifySubscribers('connection', { status: 'failed' });
    }
  }

  private notifySubscribers(channel: string, data: any) {
    const channelSubscribers = this.subscribers.get(channel);
    if (channelSubscribers) {
      channelSubscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  public subscribe(channel: string, callback: (data: any) => void) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    this.subscribers.get(channel)!.add(callback);

    // Return unsubscribe function
    return () => {
      const channelSubscribers = this.subscribers.get(channel);
      if (channelSubscribers) {
        channelSubscribers.delete(callback);
        if (channelSubscribers.size === 0) {
          this.subscribers.delete(channel);
        }
      }
    };
  }

  public subscribeToSymbol(symbol: string, callback: (data: BinanceTickerData) => void) {
    return this.subscribe(`ticker_${symbol}`, callback);
  }

  public subscribeToAll(callback: (data: BinanceTickerData) => void) {
    return this.subscribe('ticker_all', callback);
  }

  public subscribeToConnection(callback: (data: any) => void) {
    return this.subscribe('connection', callback);
  }

  public getConnectionStatus() {
    return this.isConnected;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }
}

// Singleton instance
let binanceWS: BinanceWebSocket | null = null;

export const getBinanceWebSocket = () => {
  if (typeof window !== 'undefined' && !binanceWS) {
    binanceWS = new BinanceWebSocket();
  }
  return binanceWS;
};