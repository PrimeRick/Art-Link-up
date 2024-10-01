import React from "react"
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { FieldValues, useForm } from "react-hook-form"

import { getSession } from "@/lib/auth"
import { useUserContext } from "@/providers/user-context"
import { fetchData } from "@/utils"

import EditLayout from "@/components/auth/edit/layout"

const EditPage = ({ Artist }: { Artist: ExtendedArtist }) => {
  const form = useForm()
  const router = useRouter()
  const { data: session } = useSession()
  console.log(session?.user?.email)
  const { handleEdit } = useUserContext()

  const handleSubmit = async (data: FieldValues) => {
    handleEdit({
      headline: data.headline,
      location: data.location,
      instagram: data.instagram,
      facebook: data.facebook,
      twitter: data.twitter,
      youtube: data.youtube,
      twitch: data.twitch,
      spotify: data.spotify,
      soundcloud: data.soundcloud,
      category: data.category,
      website: data.website,
      bio: data.bio,
      work: data.work,
      isArtist: false,
    }).then((data) => {
      if (data.success === "success") {
        router.push("/")
      }
    })
  }

  return (
    <EditLayout
      form={form}
      onSubmit={handleSubmit}
      isArtist={session?.user?.email === "ARTIST"}
      Artist={Artist}
    />
  )
}

export default EditPage
export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const session = await getSession(req as NextApiRequest, res as NextApiResponse)
  let Artist
  const { slug } = query
  if (session) Artist = await fetchData(`/v1/users/${slug}`, session?.user?.name as string, "GET")
  if (Artist?.error || !Artist?.data.user.id) {
    return {
      notFound: true,
    }
  }
  Artist = Artist?.data.user
  // console.log("these artists ", Artist)

  let user = Artist

  user = {
    id: user?.id,
    name: `${user?.first_name}  ${user?.last_name}`,
    location: user?.location,
    rating: user?.rating,
    first_name: user?.first_name,
    last_name: user?.last_name,
    username: user?.username ?? "",
    profileImage: user?.profileImage ?? "",
    email: user?.email ?? "",
    category: user?.category ?? "",
    // phone: user?.phone ?? "",
    bio: user?.bio ?? "",
    work: user?.work ?? "",
    languages: user?.languages,
    instagram: user?.instagram ?? "",
    facebook: user?.facebook ?? "",
    youtube: user?.youtube ?? "",
    twitter: user?.twitter ?? "",
    twitch: user?.twitch ?? "",
    spotify: user?.spotify ?? "",
    soundcloud: user?.soundcloud ?? "",
    website: user?.website ?? "",

    headline: user?.headline ?? "",
    Package: user.Package,
    artwork: user?.artwork,
  }

  return {
    props: {
      Artist: user,
    },
  }
}
