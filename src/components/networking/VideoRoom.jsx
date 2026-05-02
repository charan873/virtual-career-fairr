import React, { useState, useRef, useEffect } from 'react';

const VideoRoom = ({ roomName = 'Company Meeting', onLeave }) => {
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [participants, setParticipants] = useState([
        { id: 1, name: 'You', isHost: false, videoOn: true, audioOn: true },
        { id: 2, name: 'John Smith', isHost: true, videoOn: true, audioOn: true },
        { id: 3, name: 'Sarah Johnson', isHost: false, videoOn: false, audioOn: true },
        { id: 4, name: 'Mike Davis', isHost: false, videoOn: true, audioOn: false }
    ]);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'John Smith', message: 'Welcome everyone! Let\'s discuss the opportunities.', timestamp: new Date() },
        { id: 2, sender: 'Sarah Johnson', message: 'Thank you for having us!', timestamp: new Date() }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef([]);
    const streamRef = useRef(null);

    useEffect(() => {
        // Simulate getting user media (in a real app, this would use WebRTC)
        if (isVideoOn && localVideoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    streamRef.current = stream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                })
                .catch(err => console.log('Error accessing media devices:', err));
        } else if (!isVideoOn && streamRef.current) {
            // Stop the stream when video is turned off
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
            }
        }

        // Cleanup on unmount
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isVideoOn]);

    const toggleVideo = () => {
        setIsVideoOn(!isVideoOn);
        setParticipants(prev => prev.map(p =>
            p.id === 1 ? { ...p, videoOn: !isVideoOn } : p
        ));
    };

    const toggleAudio = () => {
        setIsAudioOn(!isAudioOn);
        setParticipants(prev => prev.map(p =>
            p.id === 1 ? { ...p, audioOn: !isAudioOn } : p
        ));
    };

    const toggleScreenShare = () => {
        setIsScreenSharing(!isScreenSharing);
    };

    const sendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: chatMessages.length + 1,
                sender: 'You',
                message: newMessage,
                timestamp: new Date()
            };
            setChatMessages([...chatMessages, message]);
            setNewMessage('');
        }
    };

    const handleLeave = () => {
        // Clean up media streams
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        onLeave();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold">{roomName}</h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Recording</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm">{participants.length} participants</span>
                    <button
                        onClick={() => setShowParticipants(!showParticipants)}
                        className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                    >
                        👥
                    </button>
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                    >
                        💬
                    </button>
                    <button
                        onClick={handleLeave}
                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                    >
                        Leave
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 relative">
                {/* Video Grid */}
                <div className={`flex-1 p-4 grid gap-4 ${
                    participants.length === 1 ? 'grid-cols-1' :
                    participants.length === 2 ? 'grid-cols-2' :
                    participants.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
                }`}>
                    {participants.map((participant, index) => (
                        <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                            {participant.videoOn ? (
                                <video
                                    ref={participant.id === 1 ? localVideoRef : el => remoteVideoRefs.current[index] = el}
                                    autoPlay
                                    muted={participant.id === 1}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                                            <span className="text-2xl text-white">{participant.name.charAt(0)}</span>
                                        </div>
                                        <p className="text-white font-medium">{participant.name}</p>
                                    </div>
                                </div>
                            )}

                            {/* Participant Info Overlay */}
                            <div className="absolute bottom-2 left-2 flex items-center gap-2">
                                <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                    {participant.name}
                                    {participant.isHost && ' (Host)'}
                                </span>
                                {!participant.audioOn && (
                                    <div className="bg-red-500 text-white p-1 rounded">
                                        🔇
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Participants Panel */}
                {showParticipants && (
                    <div className="w-80 bg-gray-800 text-white p-4 border-l border-gray-700">
                        <h3 className="text-lg font-semibold mb-4">Participants ({participants.length})</h3>
                        <div className="space-y-3">
                            {participants.map(participant => (
                                <div key={participant.id} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                        <span className="text-sm">{participant.name.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{participant.name}</p>
                                        {participant.isHost && <p className="text-sm text-gray-400">Host</p>}
                                    </div>
                                    <div className="flex gap-1">
                                        {!participant.audioOn && <span>🔇</span>}
                                        {!participant.videoOn && <span>📷</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat Panel */}
                {showChat && (
                    <div className="w-80 bg-gray-800 text-white flex flex-col border-l border-gray-700">
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold">Chat</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{msg.sender}</span>
                                        <span className="text-xs text-gray-400">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm bg-gray-700 p-2 rounded">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
                <button
                    onClick={toggleAudio}
                    className={`px-4 py-2 rounded-full font-medium ${
                        isAudioOn
                            ? 'bg-gray-600 text-white hover:bg-gray-500'
                            : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                    {isAudioOn ? '🔊 Mute' : '🔇 Unmute'}
                </button>
                <button
                    onClick={toggleVideo}
                    className={`px-4 py-2 rounded-full font-medium ${
                        isVideoOn
                            ? 'bg-gray-600 text-white hover:bg-gray-500'
                            : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                    {isVideoOn ? '📹 Stop Video' : '📷 Start Video'}
                </button>
                <button
                    onClick={toggleScreenShare}
                    className={`px-4 py-2 rounded-full font-medium ${
                        isScreenSharing
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-600 text-white hover:bg-gray-500'
                    }`}
                >
                    🖥️ Share Screen
                </button>
                <button
                    onClick={handleLeave}
                    className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700"
                >
                    End Meeting
                </button>
            </div>
        </div>
    );
};

export default VideoRoom;