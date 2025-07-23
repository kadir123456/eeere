'use client';

import { useGlobalNotifications } from '@/hooks/useGlobalNotifications';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function GlobalNotifications() {
  const { notifications, loading } = useGlobalNotifications();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  if (loading || notifications.length === 0) return null;

  const activeNotifications = notifications.filter(n => !dismissedIds.includes(n.id));

  if (activeNotifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500/20 text-yellow-300';
      case 'success':
        return 'bg-emerald-900/20 border-emerald-500/20 text-emerald-300';
      case 'error':
        return 'bg-red-900/20 border-red-500/20 text-red-300';
      default:
        return 'bg-blue-900/20 border-blue-500/20 text-blue-300';
    }
  };

  const dismissNotification = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-md">
      {activeNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`glass p-4 rounded-xl border ${getColors(notification.type)} animate-slide-up`}
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{notification.title}</h4>
              <p className="text-sm opacity-90">{notification.message}</p>
              <p className="text-xs opacity-60 mt-2">
                {new Date(notification.timestamp).toLocaleString('tr-TR')}
              </p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}