// Basitleştirilmiş TRON ödeme sistemi - Tek sabit adres (TronWeb olmadan)
export interface PaymentStatus {
  status: 'pending' | 'completed' | 'expired';
  address: string;
  amount: number;
  balance: number;
  timestamp: number;
}

export class TronPaymentSystem {
  private mainAddress: string;

  constructor() {
    // Senin sabit TRON adresin
    this.mainAddress = process.env.MAIN_TREASURY_ADDRESS || 'TYour1MainTronAddressHere123456789012345';
  }

  // Sabit ana adresini döndür
  getPaymentAddress(): string {
    return this.mainAddress;
  }

  // USDT bakiyesi kontrol et (TronGrid API kullanarak)
  async checkUSDTBalance(address: string): Promise<number> {
    try {
      // TronGrid API ile USDT bakiyesi kontrol et
      const apiKey = process.env.TRON_GRID_API_KEY;
      if (!apiKey) {
        console.log('TronGrid API key not found, using mock data');
        return Math.random() * 100; // Demo için rastgele bakiye
      }

      // USDT contract address (TRC20)
      const usdtContract = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
      
      const response = await fetch(
        `https://api.trongrid.io/v1/accounts/${address}/tokens?contract_address=${usdtContract}`,
        {
          headers: {
            'TRON-PRO-API-KEY': apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`TronGrid API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        // USDT has 6 decimals
        const balance = parseInt(data.data[0].balance) / 1000000;
        return balance;
      }
      
      return 0;
    } catch (error) {
      console.error('Error checking USDT balance:', error);
      return 0;
    }
  }

  // Ödeme doğrulama (basitleştirilmiş)
  async validatePayment(expectedAmount: number): Promise<PaymentStatus> {
    const balance = await this.checkUSDTBalance(this.mainAddress);
    
    return {
      status: balance >= expectedAmount ? 'completed' : 'pending',
      address: this.mainAddress,
      amount: expectedAmount,
      balance,
      timestamp: Date.now()
    };
  }

  // Manuel ödeme onaylama (admin için)
  async approvePayment(userId: string, amount: number): Promise<boolean> {
    try {
      // Bu fonksiyon admin panelinden çağrılacak
      console.log(`Manual payment approval for user ${userId}: ${amount} USDT`);
      return true;
    } catch (error) {
      console.error('Error approving payment:', error);
      return false;
    }
  }
}

// Singleton instance
let tronPayment: TronPaymentSystem | null = null;

export const getTronPaymentSystem = () => {
  if (!tronPayment) {
    tronPayment = new TronPaymentSystem();
  }
  return tronPayment;
};
