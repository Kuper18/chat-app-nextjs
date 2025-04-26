import { cn, parseJwt } from '@/lib/utils';
import { TMessage } from '@/types';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type Props = {
  message: TMessage;
  isFirstUnread: boolean;
  isLastMessage: boolean;
  refLastMessage: (node?: Element | null) => void;
};

const Message = ({ message, isFirstUnread, isLastMessage, refLastMessage }: Props) => {
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

  useEffect(() => {
    if (entryFirstMessage && inViewFirstMessage) {
      entryFirstMessage.target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [entryFirstMessage, inViewFirstMessage]);

  useEffect(() => {
    if (
      currentMessageinView &&
      !message.isRead &&
      currentUserId !== message.senderId
    ) {
      console.log(message);
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
