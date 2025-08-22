import React, { useState, Suspense } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LazyNotificationCenter } from './LazyNotificationCenter';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="relative"
        aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      <Suspense fallback={<div>Carregando notificações...</div>}>
        <LazyNotificationCenter isOpen={isOpen} onClose={handleClose} />
      </Suspense>
    </>
  );
}