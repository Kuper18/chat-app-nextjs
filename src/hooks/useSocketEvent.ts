import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

type Params<T> = {
  event: string;
  roomId: string | number;
  socket: Socket | null;
  callback: (data: T) => void;
};

const useSocketEvent = <T>({ event, socket, roomId, callback }: Params<T>) => {
  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event);
    };
  }, [roomId, socket]);
};

export default useSocketEvent;
