import React, { useState } from 'react';

const ChatBox = ({ companyName }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello! Welcome to ${companyName}'s booth. How can we help you today?`, sender: 'recruiter' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user'
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Simulate recruiter response
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          text: "Thank you for your message. Our team will get back to you soon!",
          sender: 'recruiter'
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-96">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold">Chat with {companyName} Recruiter</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(message => (
          <div
            key={message.id}
            className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-2 rounded-lg max-w-xs ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;