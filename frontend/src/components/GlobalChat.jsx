import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const GlobalChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      user: user?.kakaoId || '알 수 없음',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-800">전체 채팅</h3>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            아직 메시지가 없습니다. 첫 번째 메시지를 보내보세요!
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-blue-600">
                  {message.user}
                </span>
                <span className="text-xs text-gray-400">
                  {message.timestamp}
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg p-2 max-w-xs">
                <p className="text-sm text-gray-800">{message.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      <div className="p-3 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default GlobalChat; 