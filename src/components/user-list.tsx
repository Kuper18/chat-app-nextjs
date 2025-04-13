'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { TUser } from '@/types';
import UsersService from '@/services/users';
import RoomsService from '@/services/rooms';
import { useRouter } from 'next/navigation';

interface UserListProps {
  searchQuery: string;
}

export function UserList({ searchQuery }: UserListProps) {
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [users, setUsers] = React.useState<TUser[]>([]);
  const router = useRouter();

  const handleClick = async (user: TUser) => {
    setSelectedUser(user);
    const room = await RoomsService.get(user.id);
    console.log(room);

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
    UsersService.get()
      .then(setUsers)
      .catch((e) => console.log(e));
  }, []);

  return (
    <SidebarMenu>
      {users.length > 0 ? (
        users.map(({ firstName, lastName, id, email }) => (
          <SidebarMenuItem key={id}>
            <SidebarMenuButton
              asChild
              isActive={selectedUser?.id === id}
              onClick={() => handleClick({ email, firstName, id, lastName })}
            >
              <button className="w-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{`${firstName} ${lastName}`}</span>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))
      ) : (
        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
          No users found
        </div>
      )}
    </SidebarMenu>
  );
}
