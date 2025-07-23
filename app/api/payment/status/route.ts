import { NextRequest, NextResponse } from 'next/server';
import { realtimeDb, dbRef, dbGet } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get payment info from Firebase
    const paymentRef = dbRef(realtimeDb, `users/${userId}/paymentInfo`);
    const snapshot = await dbGet(paymentRef);
    const paymentInfo = snapshot.val();

    if (!paymentInfo) {
      return NextResponse.json({ error: 'Payment info not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: paymentInfo.status,
      address: paymentInfo.pendingAddress,
      amount: paymentInfo.pendingAmount,
      timestamp: paymentInfo.requestTimestamp
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 });
  }
}