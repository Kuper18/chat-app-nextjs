"use client"

import * as React from "react"
import { User } from "lucide-react"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

// Mock user data
const users = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com",},
  { id: 2, name: "Sam Smith", email: "sam@example.com", role: "User" },
  { id: 3, name: "Taylor Wilson", email: "taylor@example.com", role: "Editor" },
  { id: 4, name: "Jordan Lee", email: "jordan@example.com", role: "User" },
  { id: 5, name: "Casey Brown", email: "casey@example.com", role: "Admin" },
  { id: 6, name: "Riley Garcia", email: "riley@example.com", role: "User" },
  { id: 7, name: "Morgan Miller", email: "morgan@example.com", role: "Editor" },
  { id: 8, name: "Jamie Davis", email: "jamie@example.com", role: "User" },
]

interface UserListProps {
  searchQuery: string
}

export function UserList({ searchQuery }: UserListProps) {
  const [selectedUser, setSelectedUser] = React.useState<number | null>(null)

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <SidebarMenu>
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <SidebarMenuItem key={user.id}>
            <SidebarMenuButton asChild isActive={selectedUser === user.id} onClick={() => setSelectedUser(user.id)}>
              <button className="w-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))
      ) : (
        <div className="px-2 py-4 text-center text-sm text-muted-foreground">No users found</div>
      )}
    </SidebarMenu>
  )
}
