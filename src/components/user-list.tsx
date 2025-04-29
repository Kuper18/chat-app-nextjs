'use client';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import useUsers from '@/hooks/use-users';
import RoomsService from '@/services/rooms';
import { useSelectedUserStore } from '@/store/selected-user';
import { TMessage, TOnlineUsers, TUnreadCount, TUser } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import useUnreadCountMessages from '@/hooks/use-unread-count-messages';
import useSocketEvent from '@/hooks/useSocketEvent';
import { useSocket } from '@/hooks/use-socket';
import { parseJwt } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/enum';
import { toast } from 'sonner';
import { format } from 'date-fns';
import UserItem from './user-item';
import { useEffect, useState } from 'react';

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

  const [onlineUsers, setOnlineUsers] = useState<TOnlineUsers[]>([]);

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
  useSocketEvent({
    event: 'get-online-users',
    socket,
    callback: (onlineUsers: TOnlineUsers[]) => {
      setOnlineUsers(onlineUsers);
    },
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

  useEffect(() => {
    if (currentUserId && socket) {
      socket.emit('online', currentUserId);
    }
  }, [currentUserId, socket]);

  if (!users?.length) {
    return (
      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <SidebarMenu>
      {users.map((userItem) => {
        const count =
          unreadCountMessages?.find((item) => item.senderId === userItem.id)
            ?.count ?? 0;

        return (
          <SidebarMenuItem className="flex justify-between" key={userItem.id}>
            <SidebarMenuButton
              className="cursor-pointer"
              asChild
              isActive={user?.id === userItem.id}
              onClick={() => handleClick(userItem)}
            >
              <button className="w-full">
                <UserItem
                  isOnline={onlineUsers.some((u) => u.userId === userItem.id)}
                  unreadMessagesCount={count}
                  user={userItem}
                  key={userItem.id}
                />
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
