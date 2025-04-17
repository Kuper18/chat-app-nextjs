import { parseJwt } from '@/lib/utils';
import { messageSchema } from '@/schemas';
import MessagesService from '@/services/messages';
import { TMessageFormData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useParams } from 'next/navigation';
import { useSelectedUserStore } from '@/store/selected-user';

const MessageForm = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const { mutate } = useMutation({
    mutationFn: MessagesService.post,
    onSuccess: () => form.reset(),
  });

  const { user } = useSelectedUserStore();
  const senderUserId = parseJwt()?.id;

  const onSubmit = async ({ content }: TMessageFormData) => {
    if (!senderUserId || !user) return;

    mutate({
      content,
      roomId: +roomId,
      senderId: senderUserId,
      recipientId: user.id,
    });
  };

  return (
    <div className="border-t p-4">
      <Form {...form}>
        <form className="flex space-x-2" onSubmit={form.handleSubmit(onSubmit)}>
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
  );
};

export default MessageForm;
