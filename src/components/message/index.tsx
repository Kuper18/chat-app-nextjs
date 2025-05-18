import { Check, CheckCheck } from 'lucide-react';
import React from 'react';

import useReadMessage from '@/hooks/use-read-message';
import { cn, parseJwt } from '@/lib/utils';
import { TMessage, TUser } from '@/types';

import UserAvatar from '../user-avatar';

import { getTimestamp } from './utils';

type Props = {
  message: TMessage;
  isFirstUnread: boolean;
  isLastMessage: boolean;
  recipient?: TUser;
  refLastMessage: (node?: Element | null) => void;
};

const Message = ({
  message,
  isFirstUnread,
  isLastMessage,
  recipient,
  refLastMessage,
}: Props) => {
  const { handleRef } = useReadMessage({
    isFirstUnread,
    isLastMessage,
    message,
    refLastMessage,
  });

  const currentUserId = parseJwt()?.id;

  return (
    <div
      ref={handleRef}
      className={cn(
        'flex space-x-2',
        currentUserId === message.senderId ? 'justify-end' : 'justify-start',
      )}
    >
      {recipient?.id === message.senderId && (
        <UserAvatar
          firstName={recipient.firstName}
          lastName={recipient.lastName}
          isOnline
        />
      )}

      <div>
        <div
          className={cn(
            'rounded-md px-4 py-2 max-w-[500px]',
            currentUserId === message.senderId
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-muted rounded-tl-none',
          )}
        >
          <p>{message.content}</p>
        </div>

        <p
          className={cn(
            'flex items-center space-x-2',
            currentUserId === message.senderId
              ? 'justify-end'
              : 'justify-start',
          )}
        >
          <span className={cn('text-xs')}>
            {getTimestamp(new Date(message.createdAt))}
          </span>

          {currentUserId === message.senderId
            && (message.isRead ? (
              <CheckCheck size={14} className="text-blue-500" />
            ) : (
              <Check size={14} className="text-gray-400" />
            ))}
        </p>
      </div>
    </div>
  );
};

export default Message;
