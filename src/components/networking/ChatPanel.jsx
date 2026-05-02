import React, { useState, useEffect, useRef } from 'react';

const ChatPanel = ({ companyName = 'Company', onClose }) => {
    const [messages, setMessages] = useState([
        { text: `Hello! Welcome to ${companyName}. How can we help you today?`, sender: 'company', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim()) {
            const newMessage = {
                text: input,
                sender: 'student',
                timestamp: new Date()
            };
            setMessages([...messages, newMessage]);
            setInput('');

            // Simulate company response after 1-2 seconds
            setTimeout(() => {
                const responses = [
                    "Thank you for your interest! We'd love to discuss your background further.",
                    "Great question! Let me connect you with our HR team.",
                    "We have several openings that might match your profile. Would you like to schedule an interview?",
                    "Your resume looks impressive! Let's set up a time to chat about opportunities at our company."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                const companyResponse = {
                    text: randomResponse,
                    sender: 'company',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, companyResponse]);
            }, Math.random() * 1000 + 1000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold">{companyName.charAt(0)}</span>
                        </div>
                        <div>
                            <h3 className="font-semibold">{companyName}</h3>
                            <p className="text-sm opacity-90">Online</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-2xl ${
                                    msg.sender === 'student'
                                        ? 'bg-blue-600 text-white rounded-br-sm'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${
                                    msg.sender === 'student' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;