import { useEffect, useRef } from 'react';

const useAutoScroll = <T extends object>(data?: T) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [data, scrollRef]);

  return scrollRef;
};

export default useAutoScroll;
