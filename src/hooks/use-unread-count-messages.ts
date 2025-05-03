import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/enum';
import MessagesService from '@/services/messages';

const useUnreadCountMessages = () => {
  return useQuery({
    queryKey: [QueryKeys.UNREAD_COUNT_MESSAGES],
    queryFn: MessagesService.getUnreadCount,
  });
};

export default useUnreadCountMessages;
