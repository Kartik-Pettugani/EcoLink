import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getConversations } from '../../apiCalls/messageCalls';
import { getUserItems } from '../../apiCalls/itemCalls';
import useSocket from '../hooks/useSocket.jsx';

export default function MessagesInbox() {
  const { userData } = useSelector((s) => s.user);
  const meId = userData?._id;
  const navigate = useNavigate();
  const { socket, connected } = useSocket();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [convos, setConvos] = useState([]);

  const indexKey = useMemo(() => (meId ? `convosIndex:${meId}` : null), [meId]);

  // Try to seed from localStorage to avoid empty page when API not ready
  useEffect(() => {
    if (!indexKey) return;
    try {
      const arr = JSON.parse(localStorage.getItem(indexKey) || '[]');
      if (Array.isArray(arr) && arr.length) setConvos(arr);
    } catch {}
  }, [indexKey]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getConversations();
      const apiConvos = Array.isArray(res?.conversations) ? res.conversations : [];
      setConvos(apiConvos);
      // Persist to local index for offline access
      if (indexKey) {
        try { localStorage.setItem(indexKey, JSON.stringify(apiConvos)); } catch {}
      }
    } catch (e) {
      // Attempt localStorage fallback
      let hadFallback = false;
      if (e?.response?.status === 404) {
        setConvos([]);
        hadFallback = true;
      }
      try {
        const arr = JSON.parse(localStorage.getItem(indexKey) || '[]');
        if (Array.isArray(arr) && arr.length) {
          setConvos(arr);
          hadFallback = true;
        }
      } catch {}
      if (!hadFallback) {
        // Secondary fallback: build from interested users on my items
        try {
          const itemsRes = await getUserItems();
          const items = Array.isArray(itemsRes?.items) ? itemsRes.items : [];
          const derived = [];
          for (const it of items) {
            const list = Array.isArray(it.interestedUsers) ? it.interestedUsers : [];
            for (const u of list) {
              if (u?._id && u._id !== meId) {
                derived.push({
                  otherUserId: u._id,
                  otherUser: { _id: u._id, name: u.name, userName: u.userName },
                  lastMessage: null,
                  unreadCount: 0,
                });
              }
            }
          }
          // Dedup by otherUserId
          const map = new Map();
          for (const d of derived) {
            map.set(d.otherUserId, d);
          }
          const list = Array.from(map.values());
          if (list.length) {
            setConvos(list);
            try { if (indexKey) localStorage.setItem(indexKey, JSON.stringify(list)); } catch {}
            hadFallback = true;
          }
        } catch {}
        if (!hadFallback) setError('Unable to load conversations.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew = (payload) => {
      const msg = payload?.message;
      if (!msg) return;
      // If message involves me, update list (move or insert)
      if (msg.to === meId || msg.from === meId) {
        const otherId = msg.from === meId ? msg.to : msg.from;
        setConvos((prev) => {
          const without = prev.filter((c) => (c.otherUser?._id || c.otherUserId) !== otherId);
          const existing = prev.find((c) => (c.otherUser?._id || c.otherUserId) === otherId);
          const lastMessage = msg;
          const unread = (existing?.unreadCount || 0) + (msg.to === meId ? 1 : 0);
          const entry = existing ? { ...existing, lastMessage, unreadCount: unread } : {
            otherUserId: otherId,
            otherUser: existing?.otherUser || null,
            lastMessage,
            unreadCount: msg.to === meId ? 1 : 0,
          };
          return [entry, ...without];
        });
      }
    };
    // When I'm not in the specific room, server emits message:notification to my personal room
    const onNotification = (payload) => {
      const msg = payload?.message;
      if (!msg) return;
      if (msg.to !== meId && msg.from !== meId) return;
      const otherId = msg.from === meId ? msg.to : msg.from;
      setConvos((prev) => {
        const without = prev.filter((c) => (c.otherUser?._id || c.otherUserId) !== otherId);
        const existing = prev.find((c) => (c.otherUser?._id || c.otherUserId) === otherId);
        const unread = (existing?.unreadCount || 0) + (msg.to === meId ? 1 : 0);
        const entry = existing ? { ...existing, lastMessage: msg, unreadCount: unread } : {
          otherUserId: otherId,
          otherUser: existing?.otherUser || null,
          lastMessage: msg,
          unreadCount: msg.to === meId ? 1 : 0,
        };
        return [entry, ...without];
      });
    };
    socket.on('message:new', onNew);
    socket.on('message:notification', onNotification);
    return () => {
      socket.off('message:new', onNew);
      socket.off('message:notification', onNotification);
    };
  }, [socket, meId]);

  const displayName = (c) => c.otherUser?.name || c.otherUser?.userName || c.otherUserId || 'User';
  const otherIdOf = (c) => c.otherUser?._id || c.otherUserId;

  return (
    <div className="min-h-screen bg-(--bg)">
      <div className="container-app py-8 max-w-3xl">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-(--fg)">Messages</h2>
            <span className={`text-xs ${connected ? 'text-green-600' : 'text-(--muted)'}`}>{connected ? 'Live' : 'Offline'}</span>
          </div>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}
          {loading ? (
            <div className="text-(--muted)">Loading conversations...</div>
          ) : convos.length === 0 ? (
            <div className="text-(--muted)">No conversations yet.</div>
          ) : (
            <ul className="divide-y divide-(--border)">
              {convos.map((c) => (
                <li key={otherIdOf(c)} className="py-4 flex items-center justify-between hover-lift">
                  <button
                    className="text-left flex-1"
                    onClick={() => navigate(`/messages/${otherIdOf(c)}`)}
                  >
                    <div className="font-semibold text-(--fg)">{displayName(c)}</div>
                    {c.lastMessage && (
                      <div className="text-sm text-(--muted) line-clamp-1">{c.lastMessage.text}</div>
                    )}
                    {c.lastMessage?.createdAt && (
                      <div className="text-[10px] text-(--muted) mt-1">
                        {new Date(c.lastMessage.createdAt).toLocaleString()}
                      </div>
                    )}
                  </button>
                  {c.unreadCount > 0 && (
                    <span className="badge ml-3">{c.unreadCount}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
