import { QueryKeys } from '@/enum';
import MessagesService from '@/services/messages';
import { useQuery } from '@tanstack/react-query';

const useMessages = (roomId: number) => {
  return useQuery({
    queryKey: [QueryKeys.MESSAGES, roomId],
    queryFn: () => MessagesService.get(roomId),
  });
};

export default useMessages;
