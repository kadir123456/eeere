import { NextRequest, NextResponse } from 'next/server';
import { realtimeDb, dbRef, dbSet } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Sabit ödeme adresi (senin TRON adresin)
    const paymentAddress = process.env.MAIN_TREASURY_ADDRESS || 'TYour1MainTronAddressHere123456789012345';
    
    // Benzersiz ödeme ID'si oluştur (takip için)
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Ödeme bilgilerini Firebase'e kaydet
    const paymentRef = dbRef(realtimeDb, `users/${userId}/paymentInfo`);
    await dbSet(paymentRef, {
      status: 'pending',
      paymentId: paymentId,
      paymentAddress: paymentAddress,
      amount: 20, // $20 USDT for Pro subscription
      requestTimestamp: Date.now(),
      txHash: null, // Kullanıcı dolduracak
      adminNotes: null
    });

    return NextResponse.json({
      success: true,
      paymentAddress: paymentAddress,
      paymentId: paymentId,
      amount: 20,
      message: 'Ödeme talimatları oluşturuldu'
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
