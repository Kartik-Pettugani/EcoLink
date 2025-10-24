import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useSocket from './useSocket.jsx';
import { getConversationWith, sendMessage as sendMessageApi } from '../../apiCalls/messageCalls.js';

export default function useConversation(otherUserId) {
  const { userData } = useSelector((s) => s.user);
  const meId = userData?._id;
  const roomId = useMemo(() => (meId && otherUserId ? `room:${[meId, otherUserId].sort().join(':')}` : null), [meId, otherUserId]);

  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [typingFrom, setTypingFrom] = useState(null);
  const [readReceipts, setReadReceipts] = useState({});

  const indexKey = useMemo(() => (meId ? `convosIndex:${meId}` : null), [meId]);
  const convoKey = useMemo(() => (meId && otherUserId ? `convos:${meId}:${otherUserId}` : null), [meId, otherUserId]);

  const persistIndex = useCallback((updateFn) => {
    if (!indexKey) return;
    try {
      const current = JSON.parse(localStorage.getItem(indexKey) || '[]');
      const next = updateFn(current) || current;
      localStorage.setItem(indexKey, JSON.stringify(next));
    } catch {}
  }, [indexKey]);

  const persistMessage = useCallback((msg) => {
    if (!convoKey) return;
    try {
      const arr = JSON.parse(localStorage.getItem(convoKey) || '[]');
      arr.push(msg);
      localStorage.setItem(convoKey, JSON.stringify(arr));
      // update index with lastMessage
      persistIndex((list) => {
        const otherId = otherUserId;
        const without = list.filter((c) => (c.otherUserId) !== otherId);
        const existing = list.find((c) => c.otherUserId === otherId);
        const unread = existing?.unreadCount || 0; // we do not track unread locally here
        return [{ otherUserId: otherId, lastMessage: msg, unreadCount: unread }, ...without];
      });
    } catch {}
  }, [convoKey, otherUserId, persistIndex]);

  useEffect(() => {
    if (!socket || !connected || !roomId || !otherUserId) {
      return;
    }
    socket.emit('conversation:join', { roomId, otherUserId });

    const onHistory = (payload) => {
      if (payload?.roomId !== roomId) return;
      if (Array.isArray(payload?.messages)) setMessages(payload.messages);
    };

    const onNew = (payload) => {
      if (payload?.roomId !== roomId) return;
      if (payload?.message) {
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(m => 
            m._id === payload.message._id || 
            (m.text === payload.message.text && m.from === payload.message.from && Math.abs(new Date(m.createdAt) - new Date(payload.message.createdAt)) < 1000)
          );
          if (exists) return prev;
          
          // Replace optimistic message with real message from server
          const filteredPrev = prev.filter(m => !m.isOptimistic || m.text !== payload.message.text || m.from !== payload.message.from);
          return [...filteredPrev, payload.message];
        });
        persistMessage(payload.message);
      }
    };

    const onTyping = (payload) => {
      if (payload?.roomId !== roomId) return;
      setTypingFrom(payload.from);
      setTimeout(() => setTypingFrom(null), 1500);
    };

    const onReadReceipt = (payload) => {
      if (payload?.messageId) {
        setReadReceipts(prev => ({
          ...prev,
          [payload.messageId]: {
            readBy: payload.readBy,
            readAt: payload.readAt
          }
        }));
      }
    };

    socket.on('conversation:history', onHistory);
    socket.on('message:new', onNew);
    socket.on('typing', onTyping);
    socket.on('message:read', onReadReceipt);
    socket.on('error', (error) => {
      // Handle socket error silently
    });

    setLoadingHistory(true);
    getConversationWith(otherUserId)
      .then((res) => {
        if (Array.isArray(res?.messages)) setMessages(res.messages);
        else throw new Error('no-messages');
      })
      .catch(() => {
        // Fallback to localStorage
        try {
          const arr = JSON.parse(localStorage.getItem(convoKey) || '[]');
          if (Array.isArray(arr) && arr.length) setMessages(arr);
        } catch {}
      })
      .finally(() => setLoadingHistory(false));

    return () => {
      socket.off('conversation:history', onHistory);
      socket.off('message:new', onNew);
      socket.off('typing', onTyping);
      socket.off('message:read', onReadReceipt);
      socket.off('error');
      socket.emit('conversation:leave', { roomId });
    };
  }, [socket, connected, roomId, otherUserId]);

  // Polling fallback when socket is offline
  useEffect(() => {
    if (!otherUserId) return;
    let t;
    const poll = async () => {
      try {
        const res = await getConversationWith(otherUserId);
        if (Array.isArray(res?.messages)) {
          setMessages(prev => {
            // Only update if we don't have recent messages or if we're offline
            if (!connected || prev.length === 0) {
              return res.messages;
            }
            return prev;
          });
        }
      } catch {}
      t = setTimeout(poll, connected ? 15000 : 5000);
    };
    // Start polling if not connected
    if (!connected) poll();

    // Refresh on visibility change
    const onVisible = () => {
      if (document.visibilityState === 'visible') poll();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      if (t) clearTimeout(t);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [connected, otherUserId]);

  const send = useCallback(
    async (text) => {
      if (!text?.trim()) return;
      
      // Validate that we have all required data
      if (!meId || !otherUserId || !roomId) {
        return;
      }
      
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      const message = {
        _id: tempId,
        from: meId,
        to: otherUserId,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        roomId,
        isOptimistic: true, // Mark as optimistic update
      };
      setMessages((prev) => [...prev, message]);
      // Don't persist optimistic messages to localStorage
      try {
        if (socket && connected) {
          socket.emit('message:send', { roomId, to: otherUserId, text: message.text });
        } else {
          await sendMessageApi({ to: otherUserId, text: message.text });
        }
      } catch (e) {
        // Handle message sending error silently
      }
    },
    [socket, connected, roomId, otherUserId, meId]
  );

  const notifyTyping = useCallback(() => {
    if (socket && connected) {
      socket.emit('typing:start', { roomId, to: otherUserId });
    }
  }, [socket, connected, roomId, otherUserId]);

  const markAsRead = useCallback((messageId) => {
    if (socket && connected && messageId) {
      socket.emit('message:read', { messageId, roomId });
    }
  }, [socket, connected, roomId]);

  return { messages, loadingHistory, send, typingFrom, notifyTyping, connected, readReceipts, markAsRead };
}
