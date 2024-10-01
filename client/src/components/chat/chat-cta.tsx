import React from "react"

import ArtistAvatar from "../artist/artist-avatar"
import Button from "../ui/button"
interface ChatCTAProps {
  artistName: string | null
  jobTitle: string
  url: string
  sendMessage: () => void
}

const ChatCTA: React.FC<ChatCTAProps> = ({ artistName, jobTitle, url, sendMessage }) => {
  // const { connected } = useSocket()
  // const { setModal } = useModal(ModalType.CONFIRM_SEND)
  return (
    <div className="flex flex-col bg-primary-black text-primary-white">
      <div className="flex items-center justify-between border-t border-solid border-secondary-white/25 px-2 py-3 md:px-12">
        <div className="center gap-2">
          <div className="h-16 w-16">
            <ArtistAvatar url={url} />
          </div>
          <div className="">
            <div className="center gap-2">
              <h2 className="text-lg">{artistName}</h2>
            </div>
            <p className="text-sm text-primary-gray/75">{jobTitle}</p>
          </div>
        </div>
        <Button
          variant="action"
          className="p-1 text-xs hover:bg-primary-white hover:text-primary-black"
        >
          Report Issue
        </Button>
      </div>
      <div className="flex">
        <button
          className="grow border border-solid border-secondary-white/25 py-4 transition-all hover:bg-primary-black/80"
          onClick={() => {
            // console.log("true")
            // setModal({
            //   isOpen: true,
            //   onOpen: () => { console.log("opening") }
            // })
            sendMessage()
          }}
        >
          Request Update
        </button>
        <button className="grow border border-solid border-secondary-white/25 py-4 transition-all hover:bg-primary-black/80">
          Complete Commission
        </button>
      </div>
    </div>
  )
}

export default ChatCTA
