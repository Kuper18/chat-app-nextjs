import React from 'react';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type Props = {
  firstName: string;
  lastName: string;
  isOnline: boolean;
};

const UserAvatar = ({ firstName, isOnline, lastName }: Props) => {
  return (
    <div className="relative h-6">
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
  );
};

export default UserAvatar;
