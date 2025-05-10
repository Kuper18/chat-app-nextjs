import { MessageSquare, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import useDebounce from '@/hooks/use-debounce';
import useIsScrollable from '@/hooks/use-is-scrollable';
import useUsers from '@/hooks/use-users';

import CustomScrollArea from './ui/custom-scroll-area';
import Loader from './ui/loader';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from './ui/sidebar';
import { UserList } from './user-list';

const SideBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const timerRef = useRef<NodeJS.Timeout | number>(0);

  const debouncedQuery = useDebounce(searchQuery);
  const { fetchNextPage, hasNextPage, users } = useUsers(debouncedQuery);
  const { isScrollable, scrollContainerRef } = useIsScrollable([users.length]);
  const { isMobile } = useSidebar();

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (isMobile && users.length >= 20) {
      return clearTimeout(timerRef.current);
    }

    if (hasNextPage && !isScrollable) {
      timerRef.current = setTimeout(() => {
        fetchNextPage();
      });
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [isScrollable, hasNextPage, users, isMobile, fetchNextPage]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <MessageSquare className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Chat App</h1>
        </div>

        <div className="px-2 pt-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

            <SidebarInput
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={handleChangeQuery}
              type="search"
            />
          </div>
        </div>
      </SidebarHeader>

      <CustomScrollArea
        id="scrollableDiv"
        ref={scrollContainerRef}
        className="h-[calc(100vh-145px)]"
      >
        <SidebarContent>
          <SidebarGroup className="overflow-hidden">
            <SidebarGroupLabel>Users</SidebarGroupLabel>

            <SidebarGroupContent>
              <InfiniteScroll
                dataLength={users.length}
                hasMore={hasNextPage}
                next={fetchNextPage}
                loader={<Loader />}
                scrollableTarget="scrollableDiv"
              >
                <UserList users={users} />
              </InfiniteScroll>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </CustomScrollArea>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default SideBar;
