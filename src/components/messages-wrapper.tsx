import React from 'react';

type Props = {
  children: React.ReactNode;
};

const MessagesWrapper = ({ children }: Props) => {
  return (
    <section className="flex h-[calc(100vh-4rem)] overflow-hidden flex-col">
      {children}
    </section>
  );
};

export default MessagesWrapper;
