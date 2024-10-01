//   import { useLocation, useNavigate } from "react-router-dom";
//   import { useSocket } from "../contexts/SocketContext";
import { useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import { useSocket } from "@/providers/socket-context"
import { useUserContext } from "@/providers/user-context"
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query"

import useAxiosPrivate from "./use-axios-private"

export const useGetMessages = (conversationId: string) => {
  const axiosPrivate = useAxiosPrivate()
  // const router=useRouter()
  // here the navigation will be done with help of on error while destructuring of the returned usequery
  const queryOptions: UseQueryOptions<Message[], Error, Message[], QueryKey> = {
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await axiosPrivate.get("/v1/messages", {
        params: { conversationId },
      })
      return res.data
    },
    refetchOnWindowFocus: false,
    retry: (_, error: Allow) => error?.response?.status !== 401,
  }

  return useQuery<Message[], Error, Message[], QueryKey>(queryOptions)
}

export const useGetMessagesInfinite = (conversationId: string, limit = 20) => {
  const axiosPrivate = useAxiosPrivate()
  const { data: session } = useSession()
  const { user } = useUserContext()
  const queryOptions: UseInfiniteQueryOptions = {
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosPrivate.get("/v1/messages", {
        params: {
          conversationId,
          page: pageParam,
          limit,
        },
        headers: {
          Authorization: `Bearer ${session?.user?.name}`,
        },
      })
      return res.data.data.messages
    },
    enabled: Boolean(user),
    refetchOnWindowFocus: false,
    retry: (_, error: Allow) => {
      return error?.response?.status !== 401
    },
    initialPageParam: [],
    getNextPageParam: (lastPage: Allow, allPages) => {
      return lastPage?.length ? allPages.length + 1 : undefined
    },
  }

  return useInfiniteQuery(queryOptions)
}
export const useNewMessage = (
  type: string,
  conversationId: string,
  recipientId: string,
  message: string
) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const { socket } = useSocket()
  const location = useRouter()
  const pathnameRef = useRef<string>(location.pathname)
  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location])

  return useMutation<Message>({
    mutationFn: async () => {
      const res = await axiosPrivate.post("/v1/messages/new", {
        message: message,
        conversationId: conversationId,
        type,
      })
      return res.data.data.newMessage as Message
    },
    onSuccess: (data) => {
      queryClient.setQueryData<InfiniteData<Message[]>>(
        ["messages", conversationId],
        (prevData) => {
          const pages = prevData?.pages.map((page) => [...page]) ?? []
          pages[0].unshift(data)
          return { ...prevData!, pages }
        }
      )
      // Update lastMessageSent
      queryClient.setQueryData<Conversation[]>(["conversations"], (prevConversations) => {
        const conversationIndex = prevConversations!.findIndex((conv) => conv.id === conversationId)
        const updatedConversation: Conversation = {
          ...prevConversations![conversationIndex],
          lastMessageSent: {
            type: data.type,
            id: data.id,
            message: data.message,
            created_at: data.created_at,
          },
        }
        const updatedConversations = [...prevConversations!]
        updatedConversations[conversationIndex] = updatedConversation
        return updatedConversations
      })
      // Send to other user
      socket.emit("send-message", {
        id: data.id,
        authorId: data.authorId,
        type: data.type,
        recipientId,
        conversationId,
        message: data.message,
        timeSent: data.created_at,
      })
    },
    onError: (err) => {
      console.error("ERROR", err)
    },
  })
}

// export const useDeleteMessage = (conversationId: string) => {
//   const axiosPrivate = useAxiosPrivate()
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: async (messageId: string) => {
//       const res = await axiosPrivate.delete(`/v1/messages/${messageId}`)
//       return res.data
//     },
//     onSuccess: (data) => {
//       // Remove message from query
//       queryClient.setQueryData<InfiniteData<Message[]>>(
//         ["messages", conversationId],
//         (prevData) => {
//           if (prevData) {
//             const updatedPages = prevData!.pages.map((page) =>
//               page.filter((message) => message.id !== data.messageId)
//             )
//             return { ...prevData, pages: updatedPages }
//           }
//           return prevData
//         }
//       )
//       // Update lastMessageSent in conversation query
//       queryClient.setQueryData<Conversation[]>(["conversations"], (prevConversations) => {
//         const conversationIndex = prevConversations!.findIndex((conv) => conv.id === conversationId)
//         if (prevConversations![conversationIndex].lastMessageSent!.id === data.messageId) {
//           let newLastMessageSent = null
//           const messagesData = queryClient.getQueryData<InfiniteData<Message[]>>([
//             "messages",
//             conversationId,
//           ])
//           if (messagesData && messagesData.pages.length > 0) {
//             const firstPage = messagesData.pages[0]
//             newLastMessageSent = firstPage[0]
//           }

//           let lastMessageSent
//           if (newLastMessageSent === undefined) {
//             lastMessageSent = undefined
//           } else {

//             lastMessageSent = {
//               type:newLastMessageSent?.type ,
//               id: newLastMessageSent?.id,
//               message: newLastMessageSent?.message,
//               created_at: newLastMessageSent?.created_at,
//             }
//           }
//           const updatedConversation: Conversation = {
//             ...prevConversations![conversationIndex],
//             lastMessageSent: lastMessageSent,
//           }
//           const updatedConversations = [...prevConversations!]
//           updatedConversations[conversationIndex] = updatedConversation

//           return updatedConversations
//         }
//         return prevConversations
//       })
//     },
//   })
// }

// export const useEditMessage = (conversationId: string) => {
//   const axiosPrivate = useAxiosPrivate()
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: async (data: { messageId: string; message: string }) => {
//       const res = await axiosPrivate.put(`/v1/messages/${data.messageId}`, {
//         message: data.message,
//       })
//       return res.data
//     },
//     onSuccess: (data, variables) => {
//       // Update message in query
//       queryClient.setQueryData<InfiniteData<Message[]>>(
//         ["messages", conversationId],
//         (prevData) => {
//           if (prevData) {
//             const updatedPages = prevData.pages.map((page) =>
//               page.map((message) => {
//                 if (message.id === variables.messageId) {
//                   return {
//                     ...message,
//                     message: variables.message,
//                     isEdited: true,
//                   }
//                 }
//                 return message
//               })
//             )
//             return {
//               ...prevData,
//               pages: updatedPages,
//             }
//           }
//           return prevData
//         }
//       )
//       // Update lastMessageSent in conversation query
//       queryClient.setQueryData<Conversation[]>(["conversations"], (prevConversations) => {
//         if (prevConversations) {
//           const updatedConversations = prevConversations.map((conversation) => {
//             if (conversation.id === conversationId) {
//               return {
//                 ...conversation,
//                 lastMessageSent: {
//                   ...conversation.lastMessageSent!,
//                   message: variables.message,
//                 },
//               }
//             }
//             return conversation
//           })
//           return updatedConversations
//         }
//         return prevConversations
//       })
//     },
//   })
// }
