import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center justify-center space-x-1 w-fit">
      <div className="dot shrink-0 h-[6px] rounded-full w-[6px] opacity-0 bg-primary" />
      <div className="dot shrink-0 h-[6px] rounded-full w-[6px] opacity-0 bg-primary" />
      <div className="dot shrink-0 h-[6px] rounded-full w-[6px] opacity-0 bg-primary" />
    </div>
  );
};

export default TypingIndicator;
