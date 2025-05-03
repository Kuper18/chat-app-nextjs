import { TMessage, TMessageResponse } from '@/types';
import {
  FetchPreviousPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type Params = {
  fetchPreviousPage: (
    options?: FetchPreviousPageOptions,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<TMessageResponse, unknown>, Error>
  >;
  messages: TMessage[] | undefined;
  hasPreviousPage: boolean;
};

const useScrollChatMessages = ({ fetchPreviousPage, messages, hasPreviousPage }: Params) => {
  const [refLastMessage, inViewLastMessage] = useInView({
    threshold: 0.9,
  });
  const [loadMoreRef, inViewLoadMore] = useInView({
    threshold: 0.1,
  });
  const scrollMessageRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isFirstTriggerRef = useRef(true);
  const isFirstUnreadMessageRef = useRef(true);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (inViewLastMessage) {
      scrollMessageRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [messages?.length, scrollMessageRef, inViewLastMessage]);

  useEffect(() => {
    if (!isFirstUnreadMessageRef.current && isFirstRender) {
      scrollMessageRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });

      setIsFirstRender(false);
    }
  }, [scrollMessageRef, messages]);

  useEffect(() => {
    if (inViewLoadMore) {
      if (isFirstTriggerRef.current) {
        isFirstTriggerRef.current = false;
        return;
      }

      const scrollableElement = scrollAreaRef.current?.querySelector(
        '[data-slot="scroll-area-viewport"]',
      );

      if (scrollableElement && hasPreviousPage) {
        const lastScrollHeight = scrollableElement.scrollHeight;

        fetchPreviousPage().then(() => {
          setTimeout(() => {
            const newScrollHeight = scrollableElement.scrollHeight;
            const diff = newScrollHeight - lastScrollHeight;

            scrollableElement.scrollTo({ top: diff });
          }, 0);
        });
      }
    }
  }, [inViewLoadMore]);

  return {
    refLastMessage,
    loadMoreRef,
    inViewLoadMore,
    isFirstUnreadMessageRef,
    scrollAreaRef,
    isFirstTriggerRef,
    inViewLastMessage,
    scrollMessageRef,
  };
};

export default useScrollChatMessages;
