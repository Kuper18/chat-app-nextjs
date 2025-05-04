import { MessageSquare, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import useIsScrollable from '@/hooks/use-is-scrollable';
import useUsers from '@/hooks/use-users';

import CustomScrollArea from './ui/custom-scroll-area';
import { Input } from './ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from './ui/sidebar';
import { UserList } from './user-list';

const SideBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, users } =
    useUsers(searchQuery);
  const { isScrollable, scrollContainerRef } = useIsScrollable([users]);

  useEffect(() => {
    if (hasNextPage && !isScrollable) {
      fetchNextPage();
    }
  }, [users, isScrollable, hasNextPage]);

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
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
              >
                <UserList users={users} searchQuery={searchQuery} />
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
