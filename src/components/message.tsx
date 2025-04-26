import { QueryKeys } from '@/enum';
import { cn, parseJwt } from '@/lib/utils';
import MessagesService from '@/services/messages';
import { TMessage, TUnreadCount } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type Props = {
  message: TMessage;
  isFirstUnread: boolean;
  isLastMessage: boolean;
  refLastMessage: (node?: Element | null) => void;
};

const Message = ({
  message,
  isFirstUnread,
  isLastMessage,
  refLastMessage,
}: Props) => {
  const queryClient = useQueryClient();
  const [refFirstMessage, inViewFirstMessage, entryFirstMessage] = useInView({
    threshold: 1,
    triggerOnce: true,
  });
  const [currentMessageref, currentMessageinView] = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const { mutate } = useMutation({
    mutationKey: [QueryKeys.MESSAGES],
    mutationFn: MessagesService.readMessage,
    onSuccess: (message) => {
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
    },
  });

  const currentUserId = parseJwt()?.id;

  const handleRef = (refElement: HTMLDivElement | null) => {
    if (isFirstUnread) {
      refFirstMessage(refElement);
    }

    if (isLastMessage) {
      refLastMessage(refElement);
    }

    currentMessageref(refElement);
  };

  const markAsReadMessage = () => {
    mutate({
      id: message.id,
      isRead: true,
      recipientId: message.recipientId,
    });
  };

  useEffect(() => {
    if (entryFirstMessage && inViewFirstMessage) {
      entryFirstMessage.target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      markAsReadMessage();
    }
  }, [entryFirstMessage, inViewFirstMessage]);

  useEffect(() => {
    if (
      currentMessageinView &&
      !message.isRead &&
      currentUserId !== message.senderId
    ) {
      markAsReadMessage();
    }
  }, [currentMessageinView, isFirstUnread]);

  return (
    <div
      ref={handleRef}
      className={cn(
        'flex',
        currentUserId === message.senderId ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'rounded-lg px-4 py-2',
          currentUserId === message.senderId
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted',
        )}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default Message;
