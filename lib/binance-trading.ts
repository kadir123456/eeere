import ccxt from 'ccxt';
import { decryptApiKey } from './crypto-utils';

export interface TradingCredentials {
  apiKey: string;
  secretKey: string;
  testnet?: boolean;
}

export interface TradeSignal {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: number;
  price?: number;
}

export interface TradeResult {
  success: boolean;
  orderId?: string;
  error?: string;
  timestamp: number;
}

export interface EMAData {
  ema9: number;
  ema21: number;
  ema50: number;
  price: number;
  timestamp: number;
}

export class BinanceTradingBot {
  private exchange: ccxt.binance;
  private userId: string;
  private emaHistory: Map<string, number[]> = new Map();

  constructor(credentials: TradingCredentials, userId: string) {
    this.userId = userId;
    
    this.exchange = new ccxt.binance({
      apiKey: decryptApiKey(credentials.apiKey),
      secret: decryptApiKey(credentials.secretKey),
      sandbox: credentials.testnet || false,
      options: {
        defaultType: 'future', // Use futures trading
      }
    });
  }

  // Calculate EMA (Exponential Moving Average)
  private calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;
    
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  // Update price history and calculate EMAs
  updatePriceData(symbol: string, price: number): EMAData | null {
    const key = `${this.userId}_${symbol}`;
    
    if (!this.emaHistory.has(key)) {
      this.emaHistory.set(key, []);
    }
    
    const history = this.emaHistory.get(key)!;
    history.push(price);
    
    // Keep only last 100 prices for efficiency
    if (history.length > 100) {
      history.shift();
    }
    
    // Need at least 50 data points for EMA50
    if (history.length < 50) return null;
    
    return {
      ema9: this.calculateEMA(history, 9),
      ema21: this.calculateEMA(history, 21),
      ema50: this.calculateEMA(history, 50),
      price,
      timestamp: Date.now()
    };
  }

  // Generate trading signal based on EMA strategy
  generateSignal(emaData: EMAData, symbol: string): TradeSignal | null {
    const { ema9, ema21, ema50, price } = emaData;
    
    // Long signal: Price above EMA50 and EMA9 crosses above EMA21
    if (price > ema50 && ema9 > ema21) {
      return {
        symbol,
        side: 'buy',
        type: 'market',
        amount: 0.001 // This should be calculated based on user settings
      };
    }
    
    // Short signal: Price below EMA50 and EMA9 crosses below EMA21
    if (price < ema50 && ema9 < ema21) {
      return {
        symbol,
        side: 'sell',
        type: 'market',
        amount: 0.001
      };
    }
    
    return null;
  }

  // Execute trade on Binance
  async executeTrade(signal: TradeSignal): Promise<TradeResult> {
    try {
      const order = await this.exchange.createOrder(
        signal.symbol,
        signal.type,
        signal.side,
        signal.amount,
        signal.price
      );

      return {
        success: true,
        orderId: order.id,
        timestamp: Date.now()
      };
    } catch (error: any) {
      console.error(`Trade execution failed for user ${this.userId}:`, error);
      
      return {
        success: false,
        error: error.message || 'Unknown trading error',
        timestamp: Date.now()
      };
    }
  }

  // Get account balance
  async getBalance(): Promise<any> {
    try {
      return await this.exchange.fetchBalance();
    } catch (error) {
      console.error(`Balance fetch failed for user ${this.userId}:`, error);
      return null;
    }
  }

  // Get open positions
  async getPositions(): Promise<any[]> {
    try {
      return await this.exchange.fetchPositions();
    } catch (error) {
      console.error(`Positions fetch failed for user ${this.userId}:`, error);
      return [];
    }
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      await this.exchange.fetchBalance();
      return true;
    } catch (error) {
      console.error(`Connection test failed for user ${this.userId}:`, error);
      return false;
    }
  }
}