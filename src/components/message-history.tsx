"use client"

import * as React from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MessageHistoryProps {
  selectedConversation: string | null
}

export function MessageHistory({ selectedConversation }: MessageHistoryProps) {
  const [message, setMessage] = React.useState("")

  if (!selectedConversation) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <MessageIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-xl font-medium">Your messages</h3>
        <p className="mt-2 text-center text-muted-foreground">
          Select a conversation from the sidebar to view your message history
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="flex justify-start">
            <div className="rounded-lg bg-muted px-4 py-2">
              <p>Hi there! How can I help you today?</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
              <p>I have a question about the new features.</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="rounded-lg bg-muted px-4 py-2">
              <p>Sure, I'd be happy to explain the new features to you!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t p-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (message.trim()) {
              // Handle message sending here
              setMessage("")
            }
          }}
        >
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
