import { useRouter } from "next/router"

import { useUserContext } from "@/providers/user-context"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import useAxiosPrivate from "./use-axios-private"

export const useGetConversations = () => {
  const axiosPrivate = useAxiosPrivate()
  const { user } = useUserContext()
  return useQuery<Conversation[], Error>({
    queryKey: ["conversations"],
    queryFn: async (): Promise<Conversation[]> => {
      if (!user?.id) {
        return []
      }
      const res = await axiosPrivate.get(`/v1/conversation/${user?.id}`)
      const updatedConversations: Conversation[] = res.data.data.AllConversations.map(
        (conversation: Conversation) => {
          const { participants, ...rest } = conversation
          const updatedParticipants = participants.filter(
            (participant) => participant.id !== user.id
          )
          return {
            ...rest,
            participants: updatedParticipants,
          }
        }
      )

      return updatedConversations
    },
    enabled: Boolean(user),
  })
}

export const useNewConversation = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const router = useRouter()
  //   const navigate = useNavigate();
  const { user } = useUserContext()

  return useMutation<Conversation, Error, string[]>({
    mutationFn: async (participants: string[]) => {
      const res = await axiosPrivate.post("/v1/conversation/new", {
        participants,
      })
      return res.data.data.response
    },
    onSuccess: (data) => {
      const prevConversations = queryClient.getQueryData<Conversation[]>(["conversations"])
      // const ck = prevConversations?.map((data) => {
      //   return data.id
      // })
      if (!prevConversations?.some((conv) => conv.id === data.id)) {
        queryClient.setQueryData(["conversations"], [...prevConversations!, data])
      }

      const recipient = data.participants.filter((participant) => participant.id !== user?.id)[0]

      router.push({
        pathname: "/chat/dev",
        query: { id: recipient.id, title: recipient.username, conversationId: data.id },
      })

      // navigate(`/${data.id}`, { state });
    },
    onError: (err) => {
      console.error("ERROR", err)
    },
  })
}

export const useReadConversation = () => {
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const res = await axiosPrivate.put(`/v1/conversation/${conversationId}/read`)
      return res.data
    },
    onSuccess: () => {},
  })
}
