import { NextRequest, NextResponse } from 'next/server';
import { realtimeDb, dbRef, dbSet } from '@/lib/firebase';
import { getTronPaymentSystem } from '@/lib/tron-payment';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Generate unique payment address
    const tronPayment = getTronPaymentSystem();
    const paymentAddress = await tronPayment.generatePaymentAddress();
    
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