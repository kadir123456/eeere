import { NextRequest, NextResponse } from 'next/server';
import { createGlobalNotification } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { title, message, type, adminKey } = await request.json();
    
    // Basit admin key kontrolü (production'da daha güvenli olmalı)
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message required' }, { status: 400 });
    }

    const notificationId = await createGlobalNotification(title, message, type || 'info');

    return NextResponse.json({ 
      success: true, 
      notificationId,
      message: 'Global notification created successfully' 
    });

  } catch (error) {
    console.error('Error creating global notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

// Örnek kullanım:
// POST /api/admin/notification
// {
//   "title": "Sistem Bakımı",
//   "message": "Yarın saat 02:00-04:00 arası sistem bakımı yapılacaktır.",
//   "type": "warning",
//   "adminKey": "your-admin-secret-key"
// }