import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/enum';
import MessagesService from '@/services/messages';

const useMessages = (roomId: number) => {
  return useQuery({
    queryKey: [QueryKeys.MESSAGES, roomId],
    queryFn: () => MessagesService.get(roomId),
  });
};

export default useMessages;
