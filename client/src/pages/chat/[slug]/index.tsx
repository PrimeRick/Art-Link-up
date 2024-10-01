import React, { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import { useGetMessagesInfinite, useNewMessage } from "@/hooks/use-messages"
import { useSocket } from "@/providers/socket-context"
import { useUserContext } from "@/providers/user-context"
import { isValidURL } from "@/utils"

// import { useChatQuery } from "@/hooks/use-chat-query"
import ChatArea from "@/components/chat/chat-area"
import ChatCTA from "@/components/chat/chat-cta"
import ChatMessenger from "@/components/chat/chat-messenger"
import ChatLayout from "@/components/layout/layouts/chat"
import MainLayout from "@/components/layout/layouts/main"
const ChatRoomPage = () => {
  const router = useRouter()
  // const { conversationId } = ;
  const x = useSearchParams()
  const { socket } = useSocket()
  const { user, status } = useUserContext()
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("string")

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // const [parameters,setparameters]=useState();
  const id = x.get("id")
  const title = x.get("title")
  const conversationId = x.get("conversationId")
  const avatar = x.get("avatar")
  const LIMIT = 20
  const { data: messagesInfinite } = useGetMessagesInfinite(conversationId as string, LIMIT)
  const session = useSession()

  // const { mutate: newConversation } = useNewConversation()
  useEffect(() => {
    if (!session.data?.user?.name) {
      router.push("/")
    }
  }, [])

  const { mutate: newMessage } = useNewMessage(
    messageType,
    conversationId as string,
    id as string,
    message
  )

  useEffect(() => {
    setMessage(() => {
      if (messageToEdit?.message) return messageToEdit.message
      return ""
    })
  }, [messageToEdit])

  const sendMessage = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault()
    if (message.trim() === "") {
      setMessage("")
      return
    }
    newMessage()
    setTimeout(() => {
      setMessage("")
    }, 300)
  }

  const sendSysMessage = () => {
    const message = "A Request for Update has been recieved"
    setMessage(message)
    setMessageType("system")
    newMessage()
  }

  useEffect(() => {
    setMessageToEdit(null)
    if (inputRef.current) inputRef.current?.focus()
  }, [conversationId as string])
  // const scrollToBottom = () => {
  //   const messageContainers = document.getElementsByClassName('rce-container-mbox');

  //   // Check if there are message containers
  //   if (messageContainers.length > 0) {
  //     // Get the last message container
  //     const lastMessageContainer = messageContainers[messageContainers.length - 1];

  //     // Scroll to the last message container
  //     lastMessageContainer.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  // useEffect(() => {
  //   scrollToBottom()
  // }, [messagesInfinite]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messagesInfinite])
  return (
    <MainLayout
      override
      footer={false}
      parentContainerClassName="relative max-h-screen overflow-hidden"
    >
      <ChatLayout
        decoration="bg-secondary-gray h-full"
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      >
        <ChatCTA
          artistName={title}
          jobTitle={status}
          url={avatar || ""}
          sendMessage={sendSysMessage}
        />
        {!messagesInfinite ? (
          <ChatArea status="pending" messagesContainerRef={messagesContainerRef} />
        ) : (
          <ChatArea
            status={"success"}
            messagesContainerRef={messagesContainerRef}
            message={(messagesInfinite as Allow)?.pages
              .flat()
              .map((message: Message, i: number) => {
                if (message.type == "photo" && isValidURL(message.message)) {
                  return {
                    type: "photo",
                    title: user?.first_name + " " + user?.last_name,
                    position: message.authorId === user?.id ? "right" : "left",
                    data: {
                      uri: message.message,
                      status: {
                        click: false,
                        loading: 0,
                      },
                    },
                    focus: true,
                    // onMessageFocused:
                  }
                } else if (message.type == "system") {
                  return {
                    type: "system",
                    title: user?.first_name + " " + user?.last_name,
                    position: "center",
                    text: message.message,
                    focus: true,
                  }
                } else {
                  return {
                    type: "text",
                    id: i + 1, // Adjusting the id based on your requirements
                    position: message.authorId === user?.id ? "right" : "left",
                    text: message.message,
                    date: message.created_at,
                    title:
                      message.authorId === user?.id
                        ? user?.first_name + "  " + user?.last_name
                        : title,
                    titleColor: "red",
                    forwarded: false,
                    status: "sent",
                    notch: true,
                    retracted: false,
                    className: "",
                    focus: true,
                  }
                }
              })
              .reverse()}
          />
        )}
        <ChatMessenger
          conversationId={conversationId}
          id={id}
          chatId=""
          inputRef={inputRef}
          messageToEdit={messageToEdit}
          onChange={(e) => {
            setMessage(e.target.value)
            socket.emit("typing", { recipientId: id })
          }}
          sendMessage={sendMessage}
          setMessageToEdit={setMessageToEdit}
          value={message}
        />
      </ChatLayout>
    </MainLayout>
  )
}

export default ChatRoomPage
