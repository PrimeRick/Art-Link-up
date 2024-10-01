import { useState } from "react"
import { useSession } from "next-auth/react"
import { MdClose, MdUploadFile } from "react-icons/md"
import { ImageListType } from "react-images-uploading"
import { toast } from "react-toastify"

import useModal, { ModalType } from "@/atoms/use-modal"
import { useNewMessage } from "@/hooks/use-messages"
import { fetchFile } from "@/utils"
import { Dialog } from "@headlessui/react"

import Button from "../ui/button"
import ImageUpload from "../ui/image-upload"

const AddContainer: React.FC = () => {
  return (
    <div className="center h-64 w-64 flex-col gap-6 rounded-md shadow-md">
      <div className="center h-32 w-32">
        <MdUploadFile className="h-full w-full opacity-50 transition-all hover:opacity-80" />
      </div>
      <span className="text-sm font-light leading-3 tracking-wide text-primary-gray">
        Click or Drop here
      </span>
    </div>
  )
}

const ImageContainer: React.FC<{
  src: string
  onImageUpdate: () => void
  onImageRemove: () => void
}> = ({ onImageRemove, onImageUpdate, src }) => {
  return (
    <div className="group relative h-64 w-64 cursor-pointer overflow-hidden rounded-md shadow-md">
      <img src={src} alt="" className="h-full w-full object-cover object-center" />

      <div className="center -bottom-100 absolute h-0 w-full bg-gradient-radial from-black/50 via-black/40 to-transparent transition-all group-hover:bottom-0 group-hover:h-full">
        <div className="center hidden gap-2 group-hover:flex">
          <Button onClick={() => onImageUpdate()} variant="action" className="px-4 py-1">
            Update
          </Button>
          <Button onClick={() => onImageRemove()} variant="action" className="px-4 py-1">
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

const MessageFileModal = () => {
  const { modal, setModal } = useModal(ModalType.IMAGE_UPLOAD)
  const { data: session } = useSession()
  const [image, setImage] = useState<File | null | string>(null)

  const { mutate: newMessage } = useNewMessage(
    "photo",
    modal.data.conversationId as string,
    modal.data.id as string,
    image as string
  )
  const handleSendImage = async () => {
    const formdata = new FormData()
    formdata.append("file", image as File)
    const isuploaded = await fetchFile(
      "/v1/upload/file",
      session?.user?.name as string,
      "POST",
      formdata
    )
    if (isuploaded?.error) {
      toast.dismiss(isuploaded?.message)
    } else {
      setImage(isuploaded?.data?.image?.Location || "")
      setTimeout(() => {
        newMessage()
      }, 200)
    }
  }

  return (
    <Dialog
      open={modal.isOpen}
      onClose={() => {
        setModal({ isOpen: false })
        modal.onClose()
      }}
      className="relative z-[1000] rounded-2xl"
    >
      <div className="fixed inset-0 bg-primary-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex flex-col justify-end rounded-2xl p-0 md:items-center md:justify-center md:p-4">
        <Dialog.Panel className="dark:bg-dark-3 flex min-h-[580px] w-full max-w-[519px] flex-col rounded-2xl border border-solid border-[#2C3235] bg-primary-white md:min-h-[610px] md:flex-col">
          <div className="bg-light-2 dark:bg-dark-3 relative flex h-full w-full items-start justify-center md:w-full md:rounded-b-2xl md:rounded-t-none md:pt-[28px]">
            <button
              onClick={() => {
                setModal({ isOpen: false })
              }}
              className="center absolute right-0 top-2 z-[4] h-12 w-12 cursor-pointer overflow-hidden rounded-full border-solid border-primary-gray bg-primary-white p-3 transition-all hover:bg-primary-black hover:text-primary-white md:-right-3 md:-top-3 md:h-8 md:w-8 md:border md:p-1.5"
            >
              <MdClose className="h-full w-full" />
            </button>
            <div className="bg-background/10 relative mt-10 flex flex-col items-center gap-12 rounded-md p-2 md:mt-2">
              <div className="center flex-col gap-3 text-center">
                <h2>Upload your image</h2>
                <p className="px-4 text-center text-sm text-primary-gray/50">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus soluta
                  reprehenderit sed?
                </p>
              </div>
              <div className="center">
                <ImageUpload
                  multiple={false}
                  maxNumber={1}
                  AddContainer={AddContainer}
                  ImageContainer={ImageContainer}
                  className="flex w-full resize-none flex-row-reverse items-center justify-end gap-12 rounded-lg p-4 shadow-md"
                  onChange={(value: ImageListType) => {
                    if (value[0].file) {
                      setImage(value[0].file)
                    }
                  }}
                />
              </div>
              <Button
                variant="primary"
                className="px-20 py-2"
                onClick={async () => {
                  await handleSendImage()
                  setModal({ isOpen: false })
                  modal.onClose()
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default MessageFileModal
