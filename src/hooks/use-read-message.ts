import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { QueryKeys } from '@/enum';
import { readMessageOnSuccess } from '@/helpers';
import { parseJwt } from '@/lib/utils';
import MessagesService from '@/services/messages';
import { TMessage } from '@/types';

type Params = {
  isLastMessage: boolean;
  isFirstUnread: boolean;
  message: TMessage;
  refLastMessage: (node?: Element | null) => void;
};

const useReadMessage = ({
  isFirstUnread,
  isLastMessage,
  message,
  refLastMessage,
}: Params) => {
  const queryClient = useQueryClient();
  const [refFirstMessage, inViewFirstMessage, entryFirstMessage] = useInView({
    threshold: 1,
    triggerOnce: true,
  });
  const [currentMessageref, currentMessageinView] = useInView({
    threshold: 1,
    triggerOnce: true,
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

  const { mutate } = useMutation({
    mutationKey: [QueryKeys.MESSAGES],
    mutationFn: MessagesService.readMessage,
    onSuccess: readMessageOnSuccess(queryClient),
  });

  const markAsReadMessage = useCallback(() => {
    mutate({
      id: message.id,
      isRead: true,
      recipientId: message.recipientId,
    });
  }, [message.id, message.recipientId, mutate]);

  useEffect(() => {
    if (entryFirstMessage) {
      entryFirstMessage.target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      markAsReadMessage();
    }
  }, [entryFirstMessage, inViewFirstMessage, markAsReadMessage]);

  useEffect(() => {
    if (
      currentMessageinView
      && !message.isRead
      && currentUserId !== message.senderId
    ) {
      markAsReadMessage();
    }
  }, [currentMessageinView, currentUserId, markAsReadMessage]);

  return { handleRef };
};

export default useReadMessage;
