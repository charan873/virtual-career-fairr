import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url) => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        socketRef.current.onerror = (event) => {
            setError(event.message);
        };

        return () => {
            socketRef.current.close();
        };
    }, [url]);

    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        }
    };

    return { messages, error, sendMessage };
};

export default useWebSocket;