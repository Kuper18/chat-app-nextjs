import React from 'react';

import { cn } from '@/lib/utils';
import { TUser } from '@/types';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

type Props = {
  user: TUser;
  unreadMessagesCount: number;
  isOnline: boolean;
};

const UserItem = ({ user, unreadMessagesCount, isOnline }: Props) => {
  const { firstName, lastName } = user;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={`${firstName} ${lastName}`}
            />
            <AvatarFallback>{`${firstName[0]}${lastName[0]}`}</AvatarFallback>
          </Avatar>

          <span
            className={cn(
              'absolute bottom-0 right-0 w-2 h-2  border border-white rounded-full',
              isOnline ? 'bg-green-500' : 'bg-gray-400',
            )}
          />
        </div>

        <span className="text-sm">{`${firstName} ${lastName}`}</span>
      </div>

      {unreadMessagesCount > 0 && (
        <Badge className="ml-auto h-5 min-w-5 px-1.5">
          {unreadMessagesCount}
        </Badge>
      )}
    </div>
  );
};

export default UserItem;
