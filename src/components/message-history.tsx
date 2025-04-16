'use client';

import useMessages from '@/hooks/use-messages';
import { useSocket } from '@/hooks/use-socket';
import { cn, parseJwt } from '@/lib/utils';
import { TMessage } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import EmptyChatView from './empty-chat-view';
import MessageForm from './message-form';
import MessagesWrapper from './messages-wrapper';
import { ScrollArea } from './ui/scroll-area';
import useAutoScroll from '@/hooks/use-auto-scroll';
import useSocketEvent from '@/hooks/useSocketEvent';

interface Props {
  roomId: number;
}

export function MessageHistory({ roomId }: Props) {
  const queryClient = useQueryClient();
  const { data: messages } = useMessages(roomId);
  const socket = useSocket({ roomId });

  const updateMessages = (data: TMessage) => {
    queryClient.setQueryData(['messages'], (oldData?: TMessage[]) => {
      return oldData ? [...oldData, data] : oldData;
    });
  };

  useSocketEvent({
    event: 'private-message',
    roomId,
    socket,
    callback: updateMessages,
  });

  const chatContainerRef = useAutoScroll(messages);
  const currentUserId = parseJwt()?.id;

  if (!messages?.length) {
    return <EmptyChatView />;
  }

  return (
    <MessagesWrapper>
      <ScrollArea className="flex-1 h-[calc(100vh-8rem)] p-4">
        <div ref={chatContainerRef} className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                currentUserId === message.userId
                  ? 'justify-end'
                  : 'justify-start',
              )}
            >
              <div
                className={cn(
                  'rounded-lg px-4 py-2',
                  currentUserId === message.userId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted',
                )}
              >
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <MessageForm />
    </MessagesWrapper>
  );
}
