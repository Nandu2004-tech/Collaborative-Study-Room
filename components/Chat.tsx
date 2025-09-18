
import React, { useState } from 'react';
import { ChatMessage, User } from '../types';
import Icon from './Icon';

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    user: 'Dr. Anya Sharma',
    avatar: 'https://picsum.photos/seed/anya/40',
    text: "Welcome, everyone! Let's start with a quick recap of last week's topic on Cellular Respiration.",
    timestamp: '10:00 AM',
    reactions: { '👍': 3, '💡': 1 },
  },
  {
    id: 2,
    user: 'Ben Carter',
    avatar: 'https://picsum.photos/seed/ben/40',
    text: "Sounds good! I had a question about the Krebs cycle.",
    timestamp: '10:01 AM',
    reactions: {},
  },
];

interface ChatProps {
    currentUser: User;
}

const Chat: React.FC<ChatProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg: ChatMessage = {
      id: messages.length + 1,
      user: currentUser.name, // Current user
      avatar: currentUser.avatar,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {},
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Session Chat</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start space-x-3">
            <img src={msg.avatar} alt={msg.user} className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-sm">{msg.user}</span>
                <span className="text-xs text-gray-500">{msg.timestamp}</span>
              </div>
              <p className="text-sm bg-gray-700 p-2 rounded-lg mt-1">{msg.text}</p>
              <div className="flex space-x-2 mt-1">
                {Object.entries(msg.reactions).map(([emoji, count]) => (
                  <button key={emoji} className="text-xs bg-blue-900/50 text-blue-300 rounded-full px-2 py-0.5">
                    {emoji} {count}
                  </button>
                ))}
                <button className="text-xs text-gray-400 hover:text-white">
                  <Icon name="fa-face-smile" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <Icon name="fa-paper-plane" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;