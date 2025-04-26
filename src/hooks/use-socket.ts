import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = process.env.NEXT_PUBLIC_BASE_URL?.split('/api')[0] ?? 'http://localhost:8000';

type TSocketQuery = {
  roomId?: number
  userId?: number
}

export const useSocket = (query: TSocketQuery): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SERVER_URL, { query });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to the server with id:', socketInstance.id);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
