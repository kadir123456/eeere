import TronWeb from 'tronweb';

// TronGrid API configuration
const TRON_GRID_API_KEY = process.env.NEXT_PUBLIC_TRON_GRID_API_KEY || '';
const MAIN_TREASURY_ADDRESS = process.env.NEXT_PUBLIC_MAIN_TREASURY_ADDRESS || '';
const MAIN_TREASURY_PRIVATE_KEY = process.env.MAIN_TREASURY_PRIVATE_KEY || '';

// USDT TRC20 Contract Address
const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

export interface PaymentAddress {
  address: string;
  privateKey: string;
}

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'expired';
  address: string;
  amount: number;
  balance: number;
  timestamp: number;
}

export class TronPaymentSystem {
  private tronWeb: any;

  constructor() {
    if (!TronWeb) {
      throw new Error('TronWeb is not available in this environment');
    }
    
    this.tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      headers: { 'TRON-PRO-API-KEY': TRON_GRID_API_KEY },
      privateKey: MAIN_TREASURY_PRIVATE_KEY
    });
  }

  // Generate unique payment address for user
  async generatePaymentAddress(): Promise<PaymentAddress> {
    try {
      const account = await this.tronWeb.createAccount();
      return {
        address: account.address.base58,
        privateKey: account.privateKey
      };
    } catch (error) {
      console.error('Error generating payment address:', error);
      throw new Error('Failed to generate payment address');
    }
  }

  // Check USDT balance of an address
  async checkUSDTBalance(address: string): Promise<number> {
    try {
      const contract = await this.tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
      const balance = await contract.balanceOf(address).call();
      
      // USDT has 6 decimals
      return parseFloat(this.tronWeb.fromSun(balance)) / 1000000;
    } catch (error) {
      console.error('Error checking USDT balance:', error);
      return 0;
    }
  }

  // Transfer USDT from payment address to main treasury
  async sweepUSDTToTreasury(fromPrivateKey: string, amount: number): Promise<boolean> {
    try {
      // Create temporary TronWeb instance with payment address private key
      const tempTronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers: { 'TRON-PRO-API-KEY': TRON_GRID_API_KEY },
        privateKey: fromPrivateKey
      });

      const contract = await tempTronWeb.contract().at(USDT_CONTRACT_ADDRESS);
      const amountInSun = tempTronWeb.toSun(amount * 1000000); // Convert to USDT decimals

      // Transfer USDT to main treasury
      const result = await contract.transfer(MAIN_TREASURY_ADDRESS, amountInSun).send();
      
      return result && result.txid;
    } catch (error) {
      console.error('Error sweeping USDT to treasury:', error);
      return false;
    }
  }

  // Validate payment and return status
  async validatePayment(address: string, expectedAmount: number): Promise<PaymentStatus> {
    const balance = await this.checkUSDTBalance(address);
    
    return {
      status: balance >= expectedAmount ? 'completed' : 'pending',
      address,
      amount: expectedAmount,
      balance,
      timestamp: Date.now()
    };
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
