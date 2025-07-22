'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

import { QueryKeys } from '@/enum';
import { updateMessages } from '@/helpers';
import useRoom from '@/hooks/use-room';
import useScrollChatMessages from '@/hooks/use-scroll-chat-messages';
import { useSocket } from '@/hooks/use-socket';
import useSocketEvent from '@/hooks/useSocketEvent';
import { parseJwt } from '@/lib/utils';
import MessagesService from '@/services/messages';
import { TMessage, TMessageResponse } from '@/types';

import EmptyChatView from './empty-chat-view';
import Message from './message';
import MessageForm from './message-form';
import MessagesWrapper from './messages-wrapper';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export const MessageHistory = () => {
  const queryClient = useQueryClient();

  const { roomId } = useParams<{ roomId: string }>();

  const currentUserId = parseJwt()?.id;
  const socket = useSocket();

  const { data: room } = useRoom(currentUserId as number);
  const recipient = room?.users.find((u) => u.id !== currentUserId);

  const { data, hasPreviousPage, fetchPreviousPage } = useInfiniteQuery({
    queryKey: [QueryKeys.MESSAGES, roomId],
    queryFn: async ({ pageParam }): Promise<TMessageResponse> => {
      return MessagesService.get(+roomId, pageParam);
    },
    initialPageParam: 0,
    gcTime: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
  });

  const messages = useMemo(
    () => data?.pages.reduce((acc, page) => {
      return [...acc, ...page.messages];
    }, [] as TMessage[]),
    [data],
  );

  const {
    scrollAreaRef,
    isFirstUnreadMessageRef,
    loadMoreRef,
    refLastMessage,
    scrollMessageRef,
  } = useScrollChatMessages({ messages, fetchPreviousPage, hasPreviousPage });

  useSocketEvent({
    event: 'private-message',
    id: roomId,
    socket,
    callback: updateMessages(queryClient, +roomId),
  });

  useEffect(() => {
    if (socket) {
      socket.emit('join-room', +roomId);
    }

    return () => {
      if (socket) {
        socket.emit('leave-room', +roomId);
      }
    };
  }, [socket, roomId]);

  if (!messages?.length) {
    return <EmptyChatView />;
  }

  return (
    <MessagesWrapper>
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 h-[calc(100vh-8rem)] p-4 pb-10"
      >
        <div ref={scrollMessageRef} className="relative space-y-4">
          <Button
            className="absolute z-[-1] pointer-events-none h-0 w-0 p-0 m-0 opacity-0"
            aria-hidden
            aria-label="Load more messages"
            ref={loadMoreRef}
          />

          {messages.map((message, index) => {
            const isFirstUnread = !message.isRead
              && messages.findIndex((m) => !m.isRead) === index
              && currentUserId !== message.senderId;

            isFirstUnreadMessageRef.current = isFirstUnread;

            return (
              <Message
                key={message.id}
                isFirstUnread={isFirstUnread}
                isLastMessage={index === messages.length - 1}
                message={message}
                refLastMessage={refLastMessage}
                recipient={recipient}
              />
            );
          })}
        </div>
      </ScrollArea>

      <MessageForm />
    </MessagesWrapper>
  );
};
