'use client';

import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

import { TSocketQuery } from '@/types';

const SERVER_URL = process.env.NEXT_PUBLIC_BASE_URL?.split('/api')[0] ?? 'http://localhost:8000';

type TSocketContext = {
  socket: Socket | null;
  connectSocket: (query?: TSocketQuery) => void;
  disconnectSocket: () => void;
};

const SocketContext = createContext<TSocketContext>({
  socket: null,
  connectSocket: () => {},
  disconnectSocket: () => {},
});

export const useSocketContext = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = (query?: TSocketQuery) => {
    if (socket) {
      socket.disconnect();
    }

    const socketInstance = io(SERVER_URL, { query });

    socketInstance.on('connect', () => {
      console.log('Connected to the server with id:', socketInstance.id);
    });

    setSocket(socketInstance);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
