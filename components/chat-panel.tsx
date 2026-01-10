"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

interface Message {
  id: number
  username: string
  content: string
  timestamp: string
}

interface ChatPanelProps {
  roomId: string
  userName: string
  userId?: string
}

export function ChatPanel({ roomId, userName, userId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/chat?roomId=${roomId}`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages)
        }
      } catch (error) {
        console.error("[v0] Failed to load messages:", error)
      }
    }

    loadMessages()
    const interval = setInterval(loadMessages, 3000)
    return () => clearInterval(interval)
  }, [roomId])

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          userId: userId || "anonymous",
          userName,
          message: newMessage,
        }),
      })

      if (response.ok) {
        setNewMessage("")
        const resData = await response.json()
        if (resData.success) {
          // Immediately add to local state for better UX
          const optimisticMsg: Message = {
            id: resData.messageId,
            username: userName,
            content: newMessage,
            timestamp: resData.createdAt || new Date().toISOString()
          }
          setMessages(prev => [...prev, optimisticMsg])
        }
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Chat</h3>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-sm text-primary">{msg.username}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bg-muted p-2 rounded-lg rounded-tl-none inline-block max-w-[90%]">
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
