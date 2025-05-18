import { useEffect } from 'react';

export default function useWebSocket(onMessageCallback) {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (onMessageCallback) onMessageCallback(message);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, [onMessageCallback]);
}
