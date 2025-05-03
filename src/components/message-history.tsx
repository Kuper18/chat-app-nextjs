'use client';

import { useSocket } from '@/hooks/use-socket';
import { parseJwt } from '@/lib/utils';
import { TMessage, TMessageResponse } from '@/types';
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import EmptyChatView from './empty-chat-view';
import MessageForm from './message-form';
import MessagesWrapper from './messages-wrapper';
import { ScrollArea } from './ui/scroll-area';
import useSocketEvent from '@/hooks/useSocketEvent';
import { useInView } from 'react-intersection-observer';
import { useEffect, useMemo, useRef, useState } from 'react';
import Message from './message';
import { QueryKeys } from '@/enum';
import MessagesService from '@/services/messages';
import { Button } from './ui/button';
import useScrollChatMessages from '@/hooks/use-scroll-chat-messages';

interface Props {
  roomId: number;
}

export function MessageHistory({ roomId }: Props) {
  const queryClient = useQueryClient();

  const currentUserId = parseJwt()?.id;
  const socket = useSocket();

  const { data, hasPreviousPage, fetchPreviousPage } = useInfiniteQuery({
    queryKey: [QueryKeys.MESSAGES, roomId],
    queryFn: async ({ pageParam }): Promise<TMessageResponse> => {
      return await MessagesService.get(roomId, pageParam);
    },
    initialPageParam: 0,
    gcTime: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
  });

  const messages = useMemo(
    () =>
      data?.pages.reduce((acc, page) => {
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

  const updateMessages = (newMessage: TMessage) => {
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

  useSocketEvent({
    event: 'private-message',
    id: roomId,
    socket,
    callback: updateMessages,
  });

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
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 h-[calc(100vh-8rem)] p-4"
      >
        <div ref={scrollMessageRef} className="relative space-y-4">
          <Button
            className="absolute z-[-1] pointer-events-none h-0 w-0 p-0 m-0 opacity-0"
            aria-hidden={true}
            aria-label="Load more messages"
            ref={loadMoreRef}
          />

          {messages.map((message, index) => {
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
