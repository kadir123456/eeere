import WebSocket from 'ws';
import { realtimeDb, dbRef, dbOnValue, dbSet, dbOff } from './firebase';
import { BinanceTradingBot, TradeResult } from './binance-trading';
import { decryptApiKey } from './crypto-utils';

export interface UserBotConfig {
  userId: string;
  isActive: boolean;
  timeframe: string;
  leverage: number;
  positionSizePercent: number;
  allowedPairs: string[];
  apiCredentials: {
    apiKey: string;
    secretKey: string;
  };
}

export interface ActiveBot {
  userId: string;
  websocket: WebSocket | null;
  tradingBot: BinanceTradingBot;
  config: UserBotConfig;
  lastSignalTime: number;
}

export class MultiTenantBotEngine {
  private activeBots: Map<string, ActiveBot> = new Map();
  private usersRef: any;

  constructor() {
    this.usersRef = dbRef(realtimeDb, 'users');
    this.startListening();
  }

  // Start listening to user changes in Firebase
  private startListening() {
    dbOnValue(this.usersRef, (snapshot) => {
      const users = snapshot.val();
      if (!users) return;

      Object.keys(users).forEach(userId => {
        const userData = users[userId];
        const botSettings = userData.botSettings;
        const apiCredentials = userData.apiCredentials;
        const subscription = userData.subscription;

        // Check if user should have an active bot
        if (
          botSettings?.isActive && 
          apiCredentials?.apiKey && 
          apiCredentials?.secretKey &&
          subscription?.tier === 'pro' &&
          subscription?.expiresAt > Date.now()
        ) {
          this.startUserBot(userId, {
            userId,
            isActive: botSettings.isActive,
            timeframe: botSettings.timeframe || '15m',
            leverage: botSettings.leverage || 10,
            positionSizePercent: botSettings.positionSizePercent || 5,
            allowedPairs: botSettings.allowedPairs || ['BTCUSDT'],
            apiCredentials: {
              apiKey: apiCredentials.apiKey,
              secretKey: apiCredentials.secretKey
            }
          });
        } else {
          // Stop bot if conditions not met
          this.stopUserBot(userId);
        }
      });
    });
  }

  // Start bot for a specific user
  private async startUserBot(userId: string, config: UserBotConfig) {
    // Don't start if already running
    if (this.activeBots.has(userId)) {
      return;
    }

    console.log(`Starting bot for user: ${userId}`);

    try {
      // Create trading bot instance
      const tradingBot = new BinanceTradingBot({
        apiKey: config.apiCredentials.apiKey,
        secretKey: config.apiCredentials.secretKey,
        testnet: true // Set to false for production
      }, userId);

      // Test connection first
      const connectionTest = await tradingBot.testConnection();
      if (!connectionTest) {
        console.error(`Failed to connect to Binance for user: ${userId}`);
        return;
      }

      // Create WebSocket URL for user's pairs and timeframe
      const streams = config.allowedPairs.map(pair => 
        `${pair.toLowerCase()}@kline_${config.timeframe}`
      ).join('/');
      
      const wsUrl = `wss://stream.binance.com:9443/ws/${streams}`;
      const websocket = new WebSocket(wsUrl);

      const activeBot: ActiveBot = {
        userId,
        websocket,
        tradingBot,
        config,
        lastSignalTime: 0
      };

      // WebSocket event handlers
      websocket.on('open', () => {
        console.log(`WebSocket connected for user: ${userId}`);
      });

      websocket.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.processKlineData(activeBot, message);
        } catch (error) {
          console.error(`Error processing message for user ${userId}:`, error);
        }
      });

      websocket.on('error', (error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
        this.stopUserBot(userId);
      });

      websocket.on('close', () => {
        console.log(`WebSocket closed for user: ${userId}`);
        this.activeBots.delete(userId);
      });

      this.activeBots.set(userId, activeBot);

    } catch (error) {
      console.error(`Failed to start bot for user ${userId}:`, error);
    }
  }

  // Stop bot for a specific user
  private stopUserBot(userId: string) {
    const activeBot = this.activeBots.get(userId);
    if (activeBot) {
      console.log(`Stopping bot for user: ${userId}`);
      
      if (activeBot.websocket) {
        activeBot.websocket.close();
      }
      
      this.activeBots.delete(userId);
    }
  }

  // Process incoming kline data and generate signals
  private async processKlineData(activeBot: ActiveBot, message: any) {
    if (!message.k || !message.k.x) return; // Only process closed klines

    const { s: symbol, c: closePrice } = message.k;
    const price = parseFloat(closePrice);

    // Update EMA data
    const emaData = activeBot.tradingBot.updatePriceData(symbol, price);
    if (!emaData) return;

    // Generate trading signal
    const signal = activeBot.tradingBot.generateSignal(emaData, symbol);
    if (!signal) return;

    // Prevent too frequent signals (minimum 5 minutes between signals)
    const now = Date.now();
    if (now - activeBot.lastSignalTime < 5 * 60 * 1000) return;

    activeBot.lastSignalTime = now;

    // Execute trade
    const tradeResult = await activeBot.tradingBot.executeTrade(signal);
    
    // Log trade result to Firebase
    await this.logTradeResult(activeBot.userId, signal, tradeResult, emaData);
  }

  // Log trade result to user's Firebase record
  private async logTradeResult(
    userId: string, 
    signal: any, 
    result: TradeResult, 
    emaData: any
  ) {
    const tradeId = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tradeData = {
      signal,
      result,
      emaData,
      timestamp: Date.now()
    };

    const tradeRef = dbRef(realtimeDb, `users/${userId}/tradeHistory/${tradeId}`);
    await dbSet(tradeRef, tradeData);

    console.log(`Trade logged for user ${userId}:`, tradeData);
  }

  // Get active bots count
  getActiveBotCount(): number {
    return this.activeBots.size;
  }

  // Get active bot info
  getActiveBots(): string[] {
    return Array.from(this.activeBots.keys());
  }

  // Cleanup
  destroy() {
    // Stop all bots
    this.activeBots.forEach((_, userId) => {
      this.stopUserBot(userId);
    });

    // Remove Firebase listener
    if (this.usersRef) {
      dbOff(this.usersRef);
    }
  }
}

// Singleton instance for the bot engine
let botEngine: MultiTenantBotEngine | null = null;

export const getMultiTenantBotEngine = () => {
  if (!botEngine) {
    botEngine = new MultiTenantBotEngine();
  }
  return botEngine;
};