import { useEffect, useRef, useState } from 'react';
import { getSocket } from '../services/socket.js';
import toast from 'react-hot-toast';
import React from 'react';

export default function useSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const s = getSocket();
    socketRef.current = s;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    if (s.connected) setConnected(true);

    // Listen for interest notifications sent to this user
    const onInterestNotification = (payload) => {
      try {
        // Show a toast with item title and link to item page
        const title = payload?.itemTitle || 'An item';
        const interestedUser = payload?.interestedUser?.name || payload?.interestedUser?.userName || 'Someone';
        const itemId = payload?.itemId;
        const content = (
          <div className="flex flex-col">
            <div className="font-semibold">{interestedUser} expressed interest</div>
            <div className="text-sm">{title}</div>
            {itemId && (
              <a href={`/item/${itemId}`} className="text-xs underline mt-1" onClick={() => toast.dismiss()}>View item</a>
            )}
          </div>
        );
        toast(content, { duration: 6000 });
      } catch (e) {
        console.warn('Error handling interest notification', e);
      }
    };
    s.on('interest:notification', onInterestNotification);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('interest:notification', onInterestNotification);
    };
  }, []);

  return { socket: socketRef.current, connected };
}
