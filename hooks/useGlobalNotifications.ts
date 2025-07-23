import { useEffect, useState } from 'react';
import { realtimeDb, dbRef, dbOnValue, dbOff } from '@/lib/firebase';

export interface GlobalNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: number;
  active: boolean;
}

export function useGlobalNotifications() {
  const [notifications, setNotifications] = useState<GlobalNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const notificationsRef = dbRef(realtimeDb, 'globalNotifications');
    
    const unsubscribe = dbOnValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsList = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .filter(notification => notification.active)
          .sort((a, b) => b.timestamp - a.timestamp);
        
        setNotifications(notificationsList);
      } else {
        setNotifications([]);
      }
      setLoading(false);
    });

    return () => {
      dbOff(notificationsRef, 'value', unsubscribe);
    };
  }, []);

  return { notifications, loading };
}