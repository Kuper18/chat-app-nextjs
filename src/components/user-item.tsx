import React from 'react';

import { TUser } from '@/types';

import { Badge } from './ui/badge';
import UserAvatar from './user-avatar';

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
        <UserAvatar
          firstName={user.firstName}
          lastName={user.lastName}
          isOnline={isOnline}
        />

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
