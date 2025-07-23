import { NextRequest, NextResponse } from 'next/server';
import { realtimeDb, dbRef, dbSet, dbGet } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { userId, adminKey, approve, notes } = await request.json();
    
    // Basit admin key kontrolü
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Kullanıcının ödeme bilgilerini al
    const paymentRef = dbRef(realtimeDb, `users/${userId}/paymentInfo`);
    const snapshot = await dbGet(paymentRef);
    const paymentInfo = snapshot.val();

    if (!paymentInfo) {
      return NextResponse.json({ error: 'Payment info not found' }, { status: 404 });
    }

    if (approve) {
      // Ödemeyi onayla ve Pro aktif et
      const subscriptionRef = dbRef(realtimeDb, `users/${userId}/subscription`);
      await dbSet(subscriptionRef, {
        tier: 'pro',
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 gün
      });

      // Ödeme durumunu güncelle
      await dbSet(paymentRef, {
        ...paymentInfo,
        status: 'approved',
        approvedAt: Date.now(),
        adminNotes: notes || 'Payment approved'
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Payment approved and Pro subscription activated' 
      });
    } else {
      // Ödemeyi reddet
      await dbSet(paymentRef, {
        ...paymentInfo,
        status: 'rejected',
        rejectedAt: Date.now(),
        adminNotes: notes || 'Payment rejected'
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Payment rejected' 
      });
    }

  } catch (error) {
    console.error('Error processing payment approval:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
