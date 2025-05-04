import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSocket } from '@/hooks/use-socket';
import useSocketEvent from '@/hooks/useSocketEvent';
import { parseJwt } from '@/lib/utils';
import { messageSchema } from '@/schemas';
import MessagesService from '@/services/messages';
import { useSelectedUserStore } from '@/store/selected-user';
import { TMessageFormData, TTypingIndicator } from '@/types';

import TypingIndicator from './typing-indicator';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import UserItem from './user-item';

const MessageForm = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });
  const socket = useSocket();

  const { mutate } = useMutation({
    mutationFn: MessagesService.post,
    onSuccess: () => form.reset(),
  });

  const [typingIdicator, setTypingIdicator] = useState<TTypingIndicator | null>(
    null,
  );
  const { user, setUser } = useSelectedUserStore();
  const currentUserId = parseJwt()?.id;

  useSocketEvent({
    event: 'user-typing',
    socket,
    callback: (data: TTypingIndicator) =>
      setTypingIdicator(data.isTyping ? data : null),
  });

  const handleEmitEvent = useCallback(
    (isTyping: boolean) => {
      if (socket && currentUserId) {
        socket.emit('typing', {
          roomId,
          userId: currentUserId,
          isTyping,
        });
      }
    },
    [currentUserId, roomId, socket],
  );

  const onSubmit = async ({ content }: TMessageFormData) => {
    if (!currentUserId || !user) return;

    mutate({
      content,
      roomId: +roomId,
      senderId: currentUserId,
      recipientId: user.id,
    });
  };

  return (
    <>
      {user && typingIdicator?.isTyping && (
        <div className="absolute w-fit bottom-[70px] left-4 space-x-2 flex items-center">
          <UserItem user={user} unreadMessagesCount={0} isOnline />
          <TypingIndicator />
        </div>
      )}

      <div className="border-t p-4">
        <Form {...form}>
          <form
            className="flex space-x-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      onFocus={() => handleEmitEvent(true)}
                      placeholder="Type a message..."
                      {...field}
                      onBlur={() => {
                        field.onBlur();
                        handleEmitEvent(false);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default MessageForm;
