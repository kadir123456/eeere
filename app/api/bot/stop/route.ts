import { NextRequest, NextResponse } from 'next/server';
import { realtimeDb, dbRef, dbSet } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Update bot status in Firebase
    const botSettingsRef = dbRef(realtimeDb, `users/${userId}/botSettings/isActive`);
    await dbSet(botSettingsRef, false);

    return NextResponse.json({ success: true, message: 'Bot stopped' });

  } catch (error) {
    console.error('Error stopping bot:', error);
    return NextResponse.json({ error: 'Failed to stop bot' }, { status: 500 });
  }
}