import { useEffect, useState } from 'react';
import { getConversations } from '../../apiCalls/messageCalls';
import { useSelector } from 'react-redux';
import useSocket from './useSocket.jsx';

export default function useUnreadMessages() {
  const { userData } = useSelector((s) => s.user);
  const { socket } = useSocket();
  const [unread, setUnread] = useState(0);

  // Helper to fetch and update unread count
  const fetchUnread = async () => {
    if (!userData?._id) return;
    try {
      const res = await getConversations();
      let count = 0;
      if (Array.isArray(res?.conversations)) {
        for (const convo of res.conversations) {
          if (convo.unreadCount) count += convo.unreadCount;
        }
      }
      setUnread(count);
    } catch {
      setUnread(0);
    }
  };

  useEffect(() => {
    fetchUnread();
    // Listen for new messages via socket
    if (!socket) return;
    const updateOnMessage = () => fetchUnread();
    socket.on('message:new', updateOnMessage);
    socket.on('message:notification', updateOnMessage);
    return () => {
      socket.off('message:new', updateOnMessage);
      socket.off('message:notification', updateOnMessage);
    };
    // eslint-disable-next-line
  }, [userData?._id, socket]);

  return unread;
}
