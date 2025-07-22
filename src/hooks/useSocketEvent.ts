import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

type Params<T> = {
  event: string;
  id?: string | number;
  socket: Socket | null;
  callback: (data: T) => void;
};

const useSocketEvent = <T>({
  event, socket, id, callback,
}: Params<T>) => {
  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, id, socket]);
};

export default useSocketEvent;
