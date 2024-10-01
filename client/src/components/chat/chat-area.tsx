import React from "react"
import { MessageList, MessageType } from "react-chat-elements"
import { LuServerCrash } from "react-icons/lu"
import { RingLoader } from "react-spinners"

interface ChatAreaProps {
  status?: "error" | "success" | "pending"
  messagesContainerRef: React.RefObject<HTMLDivElement>
  message?: MessageType[]
}

// const dataSource: MessageType[] =
//   [
//     {
//       type: "text",
//       id: 1,
//       position: "left",
//       text: "Give me a message list example!",
//       date: new Date(),
//       title: "Kursat",
//       focus: false,
//       titleColor: "#000000",
//       forwarded: false,
//       replyButton: true,
//       removeButton: true,
//       status: "read",
//       notch: true,
//       retracted: false,
//     },
//     {
//       type: "text",
//       id: 2,
//       position: "right",
//       text: "That's all.",
//       date: new Date(),
//       title: "Emre",
//       focus: false,
//       titleColor: "#000000",
//       forwarded: false,
//       replyButton: true,
//       removeButton: true,
//       status: "sent",
//       notch: true,
//       retracted: false,

//     },
//   ]

const ChatArea: React.FC<ChatAreaProps> = ({ status, messagesContainerRef, message }) => {
  if (status === "pending" && !message) {
    return (
      <div className="center h-full w-full flex-col">
        <RingLoader color="#ffffff" loading />
      </div>
    )
  }
  // let x=message
  // console.log("message are coming  ", x)

  if (status === "error") {
    return (
      <div className="center h-full w-full flex-col gap-2">
        <LuServerCrash className="h-12 w-12 text-primary-gray" />
        <p className="font-light text-primary-gray">An error occured.</p>
      </div>
    )
  }

  if (message)
    return (
      <div className="h-[69%] overflow-y-scroll">
        <div className="px-4 py-6">
          <MessageList
            referance={messagesContainerRef}
            toBottomHeight={"100%"}
            className="message-list"
            lockable={true}
            dataSource={message}
            downButton={true}
            downButtonBadge={0}
          />
        </div>
      </div>
    )
}

export default ChatArea
