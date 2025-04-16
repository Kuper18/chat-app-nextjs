'use client';

import React from 'react';
import { MessageSquare, Search, Settings } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserList } from './user-list';

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <SidebarProvider>
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
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Users</SidebarGroupLabel>
            <SidebarGroupContent>
              <UserList searchQuery={searchQuery} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <h2 className="text-lg font-semibold">Chat with Alex Johnson</h2>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
