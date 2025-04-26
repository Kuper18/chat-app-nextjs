import MessagesService from '@/services/messages';
import { useQuery } from '@tanstack/react-query';

const useUnreadCountMessages = () => {
  return useQuery({
    queryKey: ['unread-count-messages'],
    queryFn: MessagesService.getUnreadCount,
  });
};

export default useUnreadCountMessages;
