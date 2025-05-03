import React from 'react';

import MessageForm from './message-form';
import MessagesWrapper from './messages-wrapper';
import MessageIcon from './ui/icons/message-icon';

const EmptyChatView = () => {
  return (
    <MessagesWrapper>
      <div className="flex flex-1 justify-center items-center">
        <div>
          <div className="flex mx-auto h-24 w-24 items-center justify-center rounded-full bg-muted">
            <MessageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-xl font-medium">
            You don&apos;t have a message history with this user
          </h3>
        </div>
      </div>

      <MessageForm />
    </MessagesWrapper>
  );
};

export default EmptyChatView;
