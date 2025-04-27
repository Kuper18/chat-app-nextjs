'use client';

import useMessages from '@/hooks/use-messages';
import { useSocket } from '@/hooks/use-socket';
import { parseJwt } from '@/lib/utils';
import { TMessage } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import EmptyChatView from './empty-chat-view';
import MessageForm from './message-form';
import MessagesWrapper from './messages-wrapper';
import { ScrollArea } from './ui/scroll-area';
import useSocketEvent from '@/hooks/useSocketEvent';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';
import Message from './message';
import { QueryKeys } from '@/enum';

interface Props {
  roomId: number;
}

export function MessageHistory({ roomId }: Props) {
  const queryClient = useQueryClient();
  const [refLastMessage, inViewLastMessage] = useInView({
    threshold: 0.9,
  });

  const { data: messages } = useMessages(roomId);
  const currentUserId = parseJwt()?.id;
  const socket = useSocket();

  const scrollRef = useRef<HTMLDivElement>(null);
  const isFirstUnreadMessageRef = useRef(true);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const updateMessages = (data: TMessage) => {
    queryClient.setQueryData(
      [QueryKeys.MESSAGES, roomId],
      (messages?: TMessage[]) => {
        return messages ? [...messages, data] : messages;
      },
    );
  };

  useSocketEvent({
    event: 'private-message',
    id: roomId,
    socket,
    callback: updateMessages,
  });

  useEffect(() => {
    if (inViewLastMessage) {
      scrollRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [messages?.length, scrollRef, inViewLastMessage]);

  useEffect(() => {
    if (!isFirstUnreadMessageRef.current && isFirstRender) {
      scrollRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });

      setIsFirstRender(false);
    }
  }, [scrollRef, messages]);

  useEffect(() => {
    if (socket) {
      socket.emit('join-room', roomId);
    }

    return () => {
      if (socket) {
        socket.emit('leave-room', roomId);
      }
    };
  }, [socket, roomId]);

  if (!messages?.length) {
    return <EmptyChatView />;
  }

  return (
    <MessagesWrapper>
      <ScrollArea className="flex-1 h-[calc(100vh-8rem)] p-4">
        <div ref={scrollRef} className="space-y-4">
          {messages?.map((message, index) => {
            const isFirstUnread =
              !message.isRead &&
              messages.findIndex((m) => !m.isRead) === index &&
              currentUserId !== message.senderId;

            isFirstUnreadMessageRef.current = isFirstUnread;

            return (
              <Message
                key={message.id}
                isFirstUnread={isFirstUnread}
                isLastMessage={index === messages.length - 1}
                message={message}
                refLastMessage={refLastMessage}
              />
            );
          })}
        </div>
      </ScrollArea>

      <MessageForm />
    </MessagesWrapper>
  );
}
