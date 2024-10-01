/// <reference types="vite/client" />
type User = {
  id: string
  username: string
  accessToken: string
  profileImage?: string
}

type Message = {
  type: string
  id: string
  message: string
  authorId: string
  created_at: Date
  isEdited: boolean
}

type Conversation = {
  id: string
  title?: string | null
  participants: {
    id: string
    username: string
    profileImage?: string
  }[]
  lastMessageSent?:
    | {
        type: string
        id: string
        message: string
        created_at: Date
      }
    | undefined
  isRead: boolean
}

type SearchResults = {
  users: User[]
  numFound: number
}

interface ConversationState {
  recipient: {
    id: string
    title: string
  }
}
interface Package {
  id: string
  actualname: string
  totalRevisions: string
  totalDays: string
  price: number
  name: string
  description: string
}
interface ExtendedArtist extends Artist {
  Package: Package[]
}
declare module "*.mp3" {
  const src: string
  export default src
}
