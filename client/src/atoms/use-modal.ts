import { atom, useAtom } from "jotai"

export enum ModalType {
  IMAGE_UPLOAD,
}

type ModalConfig<T = unknown> = {
  type: ModalType
  data: { [key: string]: T }
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

type ModalStore = {
  [key in ModalType]: ModalConfig
}

const initialModalConfig: ModalStore = {
  [ModalType.IMAGE_UPLOAD]: {
    type: ModalType.IMAGE_UPLOAD,
    data: {},
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
  },
}

const modalAtom = atom(initialModalConfig)

const useModal = (modalType: ModalType) => {
  const [modalState, setModalState] = useAtom(modalAtom)

  const setModal = (newModalState: Partial<ModalConfig>) => {
    setModalState((prev) => ({
      ...prev,
      [modalType]: {
        ...prev[modalType],
        ...newModalState,
      },
    }))
  }

  return {
    modal: modalState[modalType],
    setModal,
  }
}

export default useModal
