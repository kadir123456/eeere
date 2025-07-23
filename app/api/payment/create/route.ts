import { NextRequest, NextResponse } from 'next/server';
import { realtimeDb, dbRef, dbSet } from '@/lib/firebase';
import { getTronPaymentSystem } from '@/lib/tron-payment';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in a server environment
    if (typeof window !== 'undefined') {
      return NextResponse.json({ error: 'This endpoint only works on server' }, { status: 500 });
    }
    
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let paymentAddress;
    try {
      // Generate unique payment address
      const tronPayment = getTronPaymentSystem();
      paymentAddress = await tronPayment.generatePaymentAddress();
    } catch (error) {
      console.error('TronWeb error:', error);
      // Fallback to mock address for development
      paymentAddress = {
        address: 'TDemoAddress123456789012345678901234567890',
        privateKey: 'demo-private-key'
      };
    }
    
    // Store payment info in Firebase
    const paymentRef = dbRef(realtimeDb, `users/${userId}/paymentInfo`);
    await dbSet(paymentRef, {
      status: 'pending',
      pendingAddress: paymentAddress.address,
      pendingAmount: 20, // $20 USDT for Pro subscription
      requestTimestamp: Date.now(),
      privateKey: paymentAddress.privateKey // Store temporarily for sweeping
    });

    return NextResponse.json({
      success: true,
      paymentAddress: paymentAddress.address,
      amount: 20,
      expiresIn: 30 * 60 * 1000 // 30 minutes
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
