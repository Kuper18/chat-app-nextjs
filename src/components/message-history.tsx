'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageIcon from './ui/icons/message-icon';
import { TMessage, TMessageFormData } from '@/types';
import MessagesService from '@/services/messages';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '@/schemas';
import { cn, parseJwt } from '@/lib/utils';

interface Props {
  roomId: string;
}

export function MessageHistory({ roomId }: Props) {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const currentUserId = useMemo(() => parseJwt()?.id, [parseJwt()?.id]);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  useEffect(() => {
    MessagesService.get(+roomId).then(setMessages);
  }, []);

  const onSubmit = async ({ content }: TMessageFormData) => {
    if (!currentUserId) return;

    try {
      await MessagesService.post({
        content,
        roomId: Number(roomId),
        userId: currentUserId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!true) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <MessageIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-xl font-medium">Your messages</h3>
        <p className="mt-2 text-center text-muted-foreground">
          Select a conversation from the sidebar to view your message history
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
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
      </div>

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
                    <Input placeholder="Type a message..." {...field} />
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
    </div>
  );
}
