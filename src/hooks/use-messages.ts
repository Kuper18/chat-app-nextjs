import MessagesService from '@/services/messages';
import { useQuery } from '@tanstack/react-query';

const useMessages = (roomId: number) => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => MessagesService.get(roomId),
  });
};

export default useMessages;
