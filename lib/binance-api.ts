import crypto from 'crypto';

export interface BinanceCredentials {
  apiKey: string;
  secretKey: string;
  testnet?: boolean;
}

export interface AccountInfo {
  totalWalletBalance: string;
  totalUnrealizedProfit: string;
  totalMarginBalance: string;
  totalPositionInitialMargin: string;
  totalOpenOrderInitialMargin: string;
  totalCrossWalletBalance: string;
  totalCrossUnPnl: string;
  availableBalance: string;
}

export interface Position {
  symbol: string;
  positionAmt: string;
  entryPrice: string;
  markPrice: string;
  unRealizedProfit: string;
  liquidationPrice: string;
  leverage: string;
  maxNotionalValue: string;
  marginType: string;
  isolatedMargin: string;
  isAutoAddMargin: string;
  positionSide: string;
  notional: string;
  isolatedWallet: string;
  updateTime: number;
}

export class BinanceAPI {
  private baseURL: string;
  private credentials: BinanceCredentials;

  constructor(credentials: BinanceCredentials) {
    this.credentials = credentials;
    this.baseURL = credentials.testnet 
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com';
  }

  private createSignature(queryString: string): string {
    return crypto
      .createHmac('sha256', this.credentials.secretKey)
      .update(queryString)
      .digest('hex');
  }

  private async makeRequest(endpoint: string, params: any = {}, method: 'GET' | 'POST' = 'GET') {
    const timestamp = Date.now();
    const queryParams = new URLSearchParams({
      ...params,
      timestamp: timestamp.toString()
    });

    const signature = this.createSignature(queryParams.toString());
    queryParams.append('signature', signature);

    const url = `${this.baseURL}${endpoint}?${queryParams.toString()}`;
    
    const headers = {
      'X-MBX-APIKEY': this.credentials.apiKey,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(url, {
        method,
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Binance API Error: ${errorData.msg || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Binance API request failed:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/fapi/v1/ping');
      return true;
    } catch (error) {
      console.error('Binance connection test failed:', error);
      return false;
    }
  }

  async getAccountInfo(): Promise<AccountInfo> {
    const data = await this.makeRequest('/fapi/v2/account');
    return {
      totalWalletBalance: data.totalWalletBalance,
      totalUnrealizedProfit: data.totalUnrealizedProfit,
      totalMarginBalance: data.totalMarginBalance,
      totalPositionInitialMargin: data.totalPositionInitialMargin,
      totalOpenOrderInitialMargin: data.totalOpenOrderInitialMargin,
      totalCrossWalletBalance: data.totalCrossWalletBalance,
      totalCrossUnPnl: data.totalCrossUnPnl,
      availableBalance: data.availableBalance
    };
  }

  async getPositions(): Promise<Position[]> {
    const data = await this.makeRequest('/fapi/v2/positionRisk');
    return data.filter((pos: any) => parseFloat(pos.positionAmt) !== 0);
  }

  async placeOrder(params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT';
    quantity: string;
    price?: string;
    timeInForce?: 'GTC' | 'IOC' | 'FOK';
  }) {
    return await this.makeRequest('/fapi/v1/order', params, 'POST');
  }

  async closePosition(symbol: string) {
    const positions = await this.getPositions();
    const position = positions.find(p => p.symbol === symbol);
    
    if (!position || parseFloat(position.positionAmt) === 0) {
      throw new Error('No open position found for this symbol');
    }

    const side = parseFloat(position.positionAmt) > 0 ? 'SELL' : 'BUY';
    const quantity = Math.abs(parseFloat(position.positionAmt)).toString();

    return await this.placeOrder({
      symbol,
      side,
      type: 'MARKET',
      quantity
    });
  }

  async getOrderHistory(symbol?: string, limit: number = 50) {
    const params: any = { limit };
    if (symbol) params.symbol = symbol;
    
    return await this.makeRequest('/fapi/v1/allOrders', params);
  }
}