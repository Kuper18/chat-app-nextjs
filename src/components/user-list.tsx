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
import { TUser } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axiosInstance from '@/axios-instance';
import useUnreadCountMessages from '@/hooks/use-unread-count-messages';
import { Badge } from './ui/badge';

interface UserListProps {
  searchQuery: string;
}

export function UserList({ searchQuery }: UserListProps) {
  const { data: users } = useUsers();
  const { data: unreadCountMessages } = useUnreadCountMessages();
  const { user, setUser } = useSelectedUserStore();
  const router = useRouter();

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
              <button className="w-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="relative flex flex-col items-start">
                  <span className="text-sm font-medium">{`${firstName} ${lastName}`}</span>
                </div>
              </button>
            </SidebarMenuButton>
            {count && <Badge className="min-w-8 shrink-0">{count}</Badge>}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
