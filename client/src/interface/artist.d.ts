interface Artist {
  id: string
  name: string
  username: string
  profileImage: string
  first_name: string
  last_name: string
  email: string

  rating: number
  headline: string
  location: string | null
  languages: string[]
  instagram: string | null
  facebook: string | null
  twitter: string | null
  youtube: string | null
  twitch: string | null
  spotify: string | null
  soundcloud: string | null
  website: string | null
  bio: string | null
  work: string | null
  createdAt: Date
  updatedAt: Date
}
