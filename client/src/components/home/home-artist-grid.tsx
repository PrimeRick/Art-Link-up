import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"

import { useUserContext } from "@/providers/user-context"

import ArtistAvatar from "../artist/artist-avatar"
import Button from "../ui/button"
import CustomRating from "../ui/rating"

interface HomeArtistGridProps {
  Artists: Allow
}

const HomeArtistGrid: React.FC<HomeArtistGridProps> = ({ Artists }) => {
  const router = useRouter()
  const { user } = useUserContext()

  const isValidElement = (item: ExtendedArtist) => item.id != user?.id ?? 0

  let counter = 0
  const newArray = (Artists ?? []).filter((item: ExtendedArtist) => {
    if (counter < 9 && isValidElement(item)) {
      counter++
      return item
    }
  })

  return (
    <div className="center my-8 flex-col gap-16">
      <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:max-w-6xl lg:grid-cols-3">
        {(newArray ?? [])
          .filter(
            (artist: Allow) =>
              artist?.Package && artist?.artwork?.length > 0 && artist?.bio && artist?.headline
          )
          .map((data: Allow, key: Allow) => (
            <div
              key={key}
              className="flex flex-col justify-between space-y-4 rounded-md p-2 shadow-md"
            >
              {!!data?.artwork.length && (
                <Image
                  src={data?.artwork[0]}
                  alt=""
                  width={200}
                  height={200}
                  className="h-64 w-full rounded-lg "
                />
              )}
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="mx-auto h-20 w-20">
                  <ArtistAvatar url={data?.profileImage} />
                </div>
                <div className="">
                  <h2 className="text-lg">
                    {data?.first_name} {data?.last_name}
                  </h2>
                  <p className="line-clamp-2 text-sm text-primary-gray/75">{data?.headline}</p>
                  <CustomRating count={data?.rating} />
                </div>
              </div>
              <p className="line-clamp-3 px-2 font-normal tracking-wide text-primary-gray/50">
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
      {/* <Button variant="secondary" className="px-16 py-2">
        See All
      </Button> */}
    </div>
  )
}

export default HomeArtistGrid
