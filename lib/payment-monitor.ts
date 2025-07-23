import { realtimeDb, dbRef, dbOnValue, dbSet, dbGet } from './firebase';
import { getTronPaymentSystem } from './tron-payment';

export interface PendingPayment {
  userId: string;
  address: string;
  amount: number;
  timestamp: number;
  privateKey: string;
}

export class PaymentMonitorService {
  private tronPayment = getTronPaymentSystem();
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  // Start monitoring payments
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Payment monitoring service started');
    
    // Check payments every minute
    this.intervalId = setInterval(() => {
      this.checkPendingPayments();
    }, 60 * 1000);

    // Initial check
    this.checkPendingPayments();
  }

  // Stop monitoring
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Payment monitoring service stopped');
  }

  // Check all pending payments
  private async checkPendingPayments() {
    try {
      const usersRef = dbRef(realtimeDb, 'users');
      const snapshot = await dbGet(usersRef);
      const users = snapshot.val();

      if (!users) return;

      for (const userId of Object.keys(users)) {
        const userData = users[userId];
        const paymentInfo = userData.paymentInfo;

        if (paymentInfo?.status === 'pending' && paymentInfo.pendingAddress) {
          await this.checkUserPayment(userId, paymentInfo);
        }
      }
    } catch (error) {
      console.error('Error checking pending payments:', error);
    }
  }

  // Check payment for specific user
  private async checkUserPayment(userId: string, paymentInfo: any) {
    try {
      const { pendingAddress, pendingAmount, requestTimestamp, privateKey } = paymentInfo;
      
      // Check if payment expired (30 minutes)
      const now = Date.now();
      if (now - requestTimestamp > 30 * 60 * 1000) {
        await this.expirePayment(userId);
        return;
      }

      // Check USDT balance
      const balance = await this.tronPayment.checkUSDTBalance(pendingAddress);
      
      if (balance >= pendingAmount) {
        console.log(`Payment confirmed for user ${userId}: ${balance} USDT`);
        await this.confirmPayment(userId, balance, privateKey);
      }
    } catch (error) {
      console.error(`Error checking payment for user ${userId}:`, error);
    }
  }

  // Confirm payment and activate Pro subscription
  private async confirmPayment(userId: string, amount: number, privateKey: string) {
    try {
      // Update subscription to Pro
      const subscriptionRef = dbRef(realtimeDb, `users/${userId}/subscription`);
      await dbSet(subscriptionRef, {
        tier: 'pro',
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      });

      // Update payment status
      const paymentRef = dbRef(realtimeDb, `users/${userId}/paymentInfo`);
      await dbSet(paymentRef, {
        status: 'completed',
        completedAt: Date.now(),
        amount: amount,
        pendingAddress: null,
        pendingAmount: null,
        privateKey: null // Clear sensitive data
      });

      // Sweep USDT to treasury
      const sweepSuccess = await this.tronPayment.sweepUSDTToTreasury(privateKey, amount);
      
      if (sweepSuccess) {
        console.log(`USDT swept to treasury for user ${userId}`);
      } else {
        console.error(`Failed to sweep USDT for user ${userId}`);
      }

      console.log(`Pro subscription activated for user ${userId}`);
    } catch (error) {
      console.error(`Error confirming payment for user ${userId}:`, error);
    }
  }

  // Expire payment request
  private async expirePayment(userId: string) {
    try {
      const paymentRef = dbRef(realtimeDb, `users/${userId}/paymentInfo`);
      await dbSet(paymentRef, {
        status: 'expired',
        expiredAt: Date.now(),
        pendingAddress: null,
        pendingAmount: null,
        privateKey: null
      });

      console.log(`Payment expired for user ${userId}`);
    } catch (error) {
      console.error(`Error expiring payment for user ${userId}:`, error);
    }
  }
}

// Singleton instance
let paymentMonitor: PaymentMonitorService | null = null;

export const getPaymentMonitorService = () => {
  if (!paymentMonitor) {
    paymentMonitor = new PaymentMonitorService();
  }
  return paymentMonitor;
};