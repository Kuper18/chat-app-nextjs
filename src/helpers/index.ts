import { InfiniteData, QueryClient } from '@tanstack/react-query';

import { QueryKeys } from '@/enum';
import { TMessage, TMessageResponse, TUnreadCount } from '@/types';

export const updateMessages =
  (queryClient: QueryClient, roomId: number) => (newMessage: TMessage) => {
    queryClient.setQueryData<InfiniteData<TMessageResponse>>(
      [QueryKeys.MESSAGES, roomId],
      (oldData) => {
        if (!oldData) return oldData;

        const lastPageIndex = oldData.pages.length - 1;

        const updatedPages = oldData.pages.map((page, index) => {
          if (index !== lastPageIndex) return page;

          return {
            ...page,
            messages: [...page.messages, newMessage],
          };
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      },
    );
  };

export const readMessageOnSuccess =
  (queryClient: QueryClient) => (message: TMessage) => {
    queryClient.setQueryData(
      [QueryKeys.UNREAD_COUNT_MESSAGES],
      (unreadCountMessages?: TUnreadCount[]) => {
        if (!unreadCountMessages) return [];

        return unreadCountMessages.map((item) => {
          if (item.senderId === message.senderId) {
            return { ...item, count: item.count - 1 };
          }

          return item;
        });
      },
    );
  };
