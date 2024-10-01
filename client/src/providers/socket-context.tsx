import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { io, Socket } from "socket.io-client"
import useSound from "use-sound"

// import { io as Client, Socket } from "socket.io-client"
import { useReadConversation } from "@/hooks/use-conversations"
import { useUserContext } from "@/providers/user-context"
import { InfiniteData, useQueryClient } from "@tanstack/react-query"

import bellSound from "../assets/audio/water-droplet-bubble-pop.mp3"
type SocketContextType = {
  socket: Socket
  onlineUserIds: string[]
}

interface ISocketProvider {
  children: React.ReactNode
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

const SocketProvider = ({ children }: ISocketProvider) => {
  const [playSound] = useSound(bellSound)
  const { user, setStatus } = useUserContext()
  const [socket, setSocket] = useState<Socket | undefined>()
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])
  const router = useRouter()
  const queryClient = useQueryClient()
  const pathnameRef = useRef<string>(router.pathname)
  const { mutate: readConversation } = useReadConversation()
  useEffect(() => {
    pathnameRef.current = router.pathname
  }, [router.query])

  useEffect(() => {
    socket?.on("online-users", (userIds: string[]) => {
      setOnlineUserIds(userIds)
    })

    socket?.on("user-connected", (userId: string) => {
      setOnlineUserIds((prevUserIds) => [...prevUserIds, userId])
    })

    socket?.on("user-disconnected", (userId: string) => {
      setOnlineUserIds((prevUserIds) => prevUserIds.filter((id) => id !== userId))
    })
    socket?.on("typing", () => {
      setTimeout(() => {
        setStatus("")
      }, 2000)
      setStatus("typing...")
    })
    socket?.on("receive-message", (receivedMessage) => {
      const { id, conversationId, authorId, message, timeSent, type } = receivedMessage
      const isViewingConversation = pathnameRef.current === `/${conversationId}`
      if (!document.hasFocus()) {
        showNotification("New Message", message)
        playSound()
      }

      // Update conversations cache
      queryClient.setQueryData<Conversation[]>(["conversations"], (prevConversations) => {
        const conversationIndex = (prevConversations ?? [])!.findIndex(
          (conv) => conv.id === conversationId
        )
        const updatedConversation: Conversation = {
          ...prevConversations![conversationIndex],
          lastMessageSent: {
            id: id,
            type,
            message,
            created_at: timeSent,
          },
          isRead: isViewingConversation,
        }
        isViewingConversation && readConversation(conversationId)
        const updatedConversations = [...prevConversations!]
        updatedConversations[conversationIndex] = updatedConversation
        return updatedConversations
      })

      // Update messages cache
      const existingMessages = queryClient.getQueryData<Message[]>(["messages", conversationId])
      if (existingMessages) {
        queryClient.setQueryData<InfiniteData<Message[]>>(
          ["messages", conversationId],
          (prevData) => {
            const pages = prevData?.pages.map((page) => [...page]) ?? []
            pages[0].unshift({
              id,
              message,
              type,
              authorId,
              created_at: timeSent,
              isEdited: false,
            })
            return { ...prevData!, pages }
          }
        )
      }
    })

    return () => {
      socket?.off("user-connected")
      socket?.off("user-disconnected")
    }
  }, [socket])

  useEffect(() => {
    if (user && process.env.NEXT_PUBLIC_API_BASE_URL) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
        query: { id: user.id.toString() },
      })
      setSocket(newSocket)
      const handleBeforeUnload = () => {
        newSocket.close()
      }

      window.addEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      return () => {
        newSocket.close()
      }
    }
  }, [user])
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission()
    }
  }, [])
  const showNotification = (title: string, message: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "https://www.vkf-renzel.com/out/pictures/generated/product/1/356_356_75/r12044336-01/general-warning-sign-10836-1.jpg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
        dir: "ltr",
      })
    }
  }

  const value = {
    socket: socket!,
    onlineUserIds,
  }
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

const useSocket = (): SocketContextType => {
  const c = useContext(SocketContext)

  if (c === undefined) {
    throw new Error("useSocket must be used within a SocketProvider")
  }

  return c
}

export { SocketProvider, useSocket }
