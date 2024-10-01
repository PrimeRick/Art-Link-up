import React, { useEffect, useState } from "react"
import { GetServerSideProps, NextPage } from "next"

// import Image from "next/image"
// import { useRouter } from "next/router"
import { useUserContext } from "@/providers/user-context"
import { fetchWithoutAuthorization } from "@/utils"

import Artworks from "@/components/artist/art-works"
// import ArtistAvatar from "@/components/artist/artist-avatar"
import ArtistProfile from "@/components/artist/artist-profile"
import MainLayout from "@/components/layout/layouts/main"
// import Button from "@/components/ui/button"
// import CustomRating from "@/components/ui/rating"

interface ArtistProfilePageProps {
  slug: string
  artist: Allow
  Artists: Allow
}

const ArtistProfilePage: NextPage<ArtistProfilePageProps> = ({ slug, artist, Artists }) => {
  const { user } = useUserContext()
  const isArtist = artist?.role === "ARTIST"
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  console.log({ Artists })

  useEffect(() => {
    if (artist?.username === user?.username) {
      setIsOwnProfile(true)
    }
  }, [artist, user])

  // const isValidElement = (item: ExtendedArtist) => item.id != artist.id

  // const counter = 0
  // const newArray = (Artists ?? []).filter((item: ExtendedArtist) => {
  //   if (counter < 3 && isValidElement(item)) {
  //     counter++
  //     return item
  //   }
  // })

  // const router = useRouter()
  return (
    <MainLayout>
      <ArtistProfile isOwn={isOwnProfile} artist={artist} slug={slug} isArtist={isArtist} />
      {isArtist && !!artist.artwork.length && (
        <>
          <Artworks artwork={artist.artwork} />
          {/* <div className="flex-col gap-16 my-4 center">
            {!!newArray?.length && <h2>Related Artists</h2>}
            <div className="grid grid-cols-1 gap-4 mx-auto md:grid-cols-2 lg:max-w-6xl lg:grid-cols-3">
              {(newArray ?? []).map((data: Allow, key: Allow) => (
                <div key={key} className="p-2 space-y-4 rounded-md shadow-md">
                  {!!data?.artwork?.length && (
                    <Image
                      alt=""
                      src={data?.artwork[0]}
                      height={200}
                      width={200}
                      className="w-full h-64 rounded-lg "
                    />
                  )}
                  <div className="flex gap-2">
                    <div className="w-20 h-20">
                      <ArtistAvatar url={data?.profileImage} />
                    </div>
                    <div className="">
                      <h2 className="text-lg">
                        {data?.first_name} {data?.last_name}
                      </h2>
                      <p className="text-sm text-primary-gray/75">{data?.headline}</p>
                      
                    </div>
                  </div>
                  <p className="px-2 font-normal tracking-wide line-clamp-1 text-primary-gray/50">
                    {data?.bio}
                  </p>
                  <Button
                    variant="primary"
                    className="w-full py-2"
                    onClick={() => {
                      router.push(`/a/${data?.id}`)
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          </div> */}
        </>
      )}
    </MainLayout>
  )
}

export default ArtistProfilePage

export const getServerSideProps: GetServerSideProps = async ({ query: { slug } }) => {
  let Artist = await fetchWithoutAuthorization(`/v1/users/${slug}`, "GET")

  if (Artist?.error || !Artist?.data.user.id) {
    return {
      redirect: {
        permanent: false,
        destination: "/?message=User doesn't exists.",
      },
      props: {},
    }
  }
  Artist = Artist?.data?.user

  let Artists
  const response = await fetchWithoutAuthorization(`/v1/users/artists`, "GET")
  if (response?.error) {
    Artists = {}
  }
  Artists = response?.data?.users

  const user: Allow = Artist

  return {
    props: {
      slug,
      artist: {
        id: user?.id,
        name: `${user?.first_name} ${user?.last_name}`,
        username: user?.username,
        image: user?.profileImage,
        email: user?.email,
        // phone: user?.phone,
        bio: user?.bio,
        work: user?.work,
        category: user?.category,

        instagram: user?.instagram,
        youtube: user?.youtube,
        website: user?.website,
        twitter: user?.twitter,
        twitch: user?.twitch,
        spotify: user?.spotify,
        soundcloud: user?.soundcloud,
        facebook: user?.facebook,

        rating: user?.rating,
        headline: user?.headline,
        Package: user?.Package ?? [],
        role: user?.role,
        artwork: user?.artwork ?? [],
      },
      Artists,
    },
  }
}
