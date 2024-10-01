import { FC, useState } from "react"
import Image from "next/image"
import { MdSend } from "react-icons/md"
import TextareaAutosize from "react-textarea-autosize"

import GalleryIcon from "@/assets/svg/icons/gallery.icon.svg"
import useModal, { ModalType } from "@/atoms/use-modal"
import useMediaQuery from "@/hooks/use-media-query"

import Button from "@/components/ui/button"

interface ChatMessengerProps {
  chatId: string
  sendMessage: (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => Promise<void>
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>
  messageToEdit: Message | null
  setMessageToEdit: React.Dispatch<React.SetStateAction<Message | null>>
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  conversationId: string | null
  id: string | null
}

const ChatMessenger: FC<ChatMessengerProps> = ({
  sendMessage,
  inputRef,
  value,
  onChange,
  conversationId,
  id,
}) => {
  const { setModal } = useModal(ModalType.IMAGE_UPLOAD)

  const isLessThan768 = useMediaQuery("max-width: 768px")

  const [isLoading] = useState<boolean>(false)

  return (
    <div className="md:center absolute bottom-0 w-full justify-between bg-primary-black p-3 md:gap-12 md:px-8 md:py-4">
      <div className="center grow gap-4">
        <button
          onClick={() => {
            if (conversationId && id) {
              setModal({
                isOpen: true,
                data: {
                  id,
                  conversationId,
                },
              })
            }
          }}
          className="scale-75 cursor-pointer md:scale-100"
        >
          <Image src={GalleryIcon} alt="Gallery Icon" width={24} height={24} />
        </button>
        <TextareaAutosize
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()

              sendMessage(e)
            }
          }}
          rows={1}
          minRows={1}
          maxRows={3}
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={`Type your message here...`}
          className="w-full resize-none rounded border-0 bg-primary-white px-4 py-1 text-gray-900 outline-none ring-0 placeholder:text-secondary-black/50"
        />
      </div>
      <div className="">
        <Button
          variant="action"
          isLoading={isLoading}
          disabled={isLoading}
          className="px-6 py-1 text-sm"
          onClick={(e) => sendMessage(e)}
          type="submit"
        >
          {isLessThan768 ? <MdSend /> : "Send"}
        </Button>
      </div>
    </div>
  )
}

export default ChatMessenger
