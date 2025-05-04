import { useEffect, useRef, useState } from 'react';

const useIsScrollable = (dependencies: any[]) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollableElement = scrollContainerRef.current;

    if (!scrollableElement) return;

    const { scrollHeight, clientHeight } = scrollableElement;

    setIsScrollable(scrollHeight > clientHeight);
  }, [...dependencies, scrollContainerRef]);

  return { isScrollable, scrollContainerRef };
};

export default useIsScrollable;
