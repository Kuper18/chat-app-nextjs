import { useSocketContext } from '@/context/socket-context';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

export const useSocket = (): Socket | null => {
  const { socket, connectSocket } = useSocketContext();

  useEffect(() => {
    if (!socket) {
      connectSocket();
    }
  }, [socket]);

  return socket;
};
