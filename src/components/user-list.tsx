'use client';

import { User } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import useUsers from '@/hooks/use-users';
import RoomsService from '@/services/rooms';
import { useSelectedUserStore } from '@/store/selected-user';
import { TMessage, TUnreadCount, TUser } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import useUnreadCountMessages from '@/hooks/use-unread-count-messages';
import { Badge } from './ui/badge';
import useSocketEvent from '@/hooks/useSocketEvent';
import { useSocket } from '@/hooks/use-socket';
import { parseJwt } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/enum';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface UserListProps {
  searchQuery: string;
}

export function UserList({ searchQuery }: UserListProps) {
  const queryClient = useQueryClient();
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();

  const { data: users } = useUsers();
  const { data: unreadCountMessages } = useUnreadCountMessages();
  const socket = useSocket();
  const { user, setUser } = useSelectedUserStore();

  const currentUserId = parseJwt()?.id;

  const showNotification = (message: TMessage) => {
    const room = Number(roomId);
    const shouldNotify =
      message.recipientId === currentUserId && message.roomId !== room;

    if (shouldNotify) {
      if (room !== message.roomId) {
        queryClient.setQueryData(
          [QueryKeys.UNREAD_COUNT_MESSAGES],
          (unreadCountMessages?: TUnreadCount[]) => {
            if (!unreadCountMessages) return [];

            const existingItem = unreadCountMessages.find(
              (item) => item.senderId === message.senderId,
            );

            if (existingItem) {
              return unreadCountMessages.map((element) =>
                element.senderId === existingItem.senderId
                  ? { ...element, count: element.count + 1 }
                  : element,
              );
            }

            return [
              ...unreadCountMessages,
              { senderId: message.senderId, count: 1 },
            ];
          },
        );

        const user = users?.find((user) => user.id === message.senderId);

        toast.info(
          `You've got a new message from ${user?.firstName} ${user?.lastName}`,
          {
            description: format(
              new Date(message.createdAt),
              'EEEE - hh:mm:ss bbb',
            ),
            closeButton: true,
            richColors: true,
            duration: 15000,
          },
        );
      }
    }
  };

  useSocketEvent({
    event: 'notification',
    socket,
    callback: showNotification,
  });

  const handleClick = async (user: TUser) => {
    setUser(user);

    const room = await RoomsService.get(user.id);

    if (!room) {
      const response = await RoomsService.post({
        peerId: user.id,
        name: 'My first room',
      });

      router.push(`/${response.id}`);

      return;
    }

    router.push(`/${room.id}`);
  };

  if (!users?.length) {
    return (
      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <SidebarMenu>
      {users.map(({ firstName, lastName, id, email }) => {
        const count = unreadCountMessages?.find(
          (item) => item.senderId === id,
        )?.count;

        return (
          <SidebarMenuItem className="flex justify-between" key={id}>
            <SidebarMenuButton
              className="cursor-pointer"
              asChild
              isActive={user?.id === id}
              onClick={() => handleClick({ email, firstName, id, lastName })}
            >
              <button className="w-full flex justify-between">
                <div className="flex space-x-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{`${firstName} ${lastName}`}</span>
                </div>

                {count && count > 0 && (
                  <Badge className="min-w-8 shrink-0">{count}</Badge>
                )}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
