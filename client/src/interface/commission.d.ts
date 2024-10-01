interface Icommission {
  backgroundDetails: string
  artworkDetails: string
  refPictures?: string[] | null // Optional array of strings or null
  packageId: string
  isFinished?: boolean | null // Optional boolean or null
  isReported?: boolean | null // Optional boolean or null
}
interface CommissionData {
  id: string
  name: string
  artistId: string
  email: string
  amount: number
  profilePicture: string
  startedOn: string
  deadline: number // Assuming deadline is a timestamp
  timeLeft: string
  isFinished: boolean
  isReported: boolean
  isPaid: boolean
  conversationId: string
}
