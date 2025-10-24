import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useConversation from '../hooks/useConversation.js';

const Messages = () => {
  const { id: otherUserId } = useParams();
  const { userData } = useSelector((s) => s.user);
  const { messages, loadingHistory, send, typingFrom, notifyTyping, connected, readReceipts, markAsRead } = useConversation(otherUserId);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Mark messages as read when they come into view
  useEffect(() => {
    const unreadMessages = messages.filter(m => 
      m.to === userData?._id && 
      !m.read && 
      m._id && 
      !m.isOptimistic
    );
    
    unreadMessages.forEach(message => {
      markAsRead(message._id);
    });
  }, [messages, userData?._id, markAsRead]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input.trim());
    setInput('');
  };

  return (
    <div className="min-h-screen bg-(--bg)">
      <div className="container-app py-8 max-w-2xl">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-(--fg)">Conversation</h2>
            <span className={`text-xs ${connected ? 'text-green-600' : 'text-(--muted)'}`}>{connected ? 'Live' : 'Offline'}</span>
          </div>
          <p className="text-(--muted) mb-4">With user: {otherUserId}</p>
          <div className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 mb-2 space-y-2">
            {loadingHistory && (
              <div className="text-center text-gray-500 text-sm">Loading history...</div>
            )}
            {messages.map((m) => {
              const mine = m.from === userData?._id || m.from === 'me';
              return (
                <div
                  key={m._id || `${m.createdAt}-${m.text}`}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'} mb-1`}
                >
                  <div
                    className={`px-3 py-2 max-w-[70%] whitespace-pre-wrap break-words ${
                      mine
                        ? 'bg-green-500 text-white rounded-lg rounded-br-sm shadow-sm'
                        : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-lg rounded-bl-sm shadow-sm border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{m.text}</div>
                    <div
                      className={`text-[10px] mt-1 flex items-center gap-1 ${
                        mine 
                          ? 'text-green-100 justify-end' 
                          : 'text-gray-500 dark:text-gray-400 justify-end'
                      }`}
                    >
                      {new Date(m.createdAt || Date.now()).toLocaleTimeString()}
                      {mine && (
                        <span className="flex items-center gap-1">
                          {m.read ? (
                            <span className="text-blue-300" title="Read">✓✓</span>
                          ) : (
                            <span className="text-gray-300" title="Delivered">✓</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          {typingFrom && typingFrom !== userData?._id && (
            <div className="text-xs text-(--muted) mb-2">Typing...</div>
          )}
          <form className="flex gap-2" onSubmit={onSubmit}>
            <input
              className="input flex-1"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={notifyTyping}
            />
            <button className="btn btn-primary" type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
