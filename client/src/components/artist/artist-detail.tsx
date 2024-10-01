import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"

import GithubIcon from "@/assets/svg/socials/github.social.svg"
import InstagramIcon from "@/assets/svg/socials/instagram.social.svg"

import Button from "../ui/button"

// import CustomRating from "../ui/rating"
import ArtistAvatar from "./artist-avatar"

interface ArtistDetailProps {
  artist: Allow
  isOwn?: boolean
  slug: string
  isArtist: boolean
}

const ArtistDetail: React.FC<ArtistDetailProps> = ({ artist, isOwn, slug, isArtist }) => {
  const router = useRouter()
  // console.log("this was the artist passee ", artist)
  const artistHasSocials =
    artist?.instagram ||
    artist?.facebook ||
    artist?.soundcloud ||
    artist?.spotify ||
    artist?.youtube ||
    artist?.twitch ||
    artist?.twitter ||
    artist?.website

  const ct = artist?.category
    ? typeof artist.category === "object"
      ? artist.category
      : JSON.parse(artist.category)
    : {}

  return (
    <div className="center min-w-[280px] flex-col space-y-4 rounded-sm border border-solid border-secondary-white py-4">
      <div className="center flex-col space-y-3 ">
        <div className="aspect-square h-32 w-32">
          <ArtistAvatar url={artist?.image} />
        </div>
        <div className="center flex-col">
          <h2>{artist?.name}</h2>
          {/* <p className="text-[12px] text-gray-600">@{artist?.email}</p> */}
          <p className="text-[12px] text-gray-600">
            {/* {(artist?.category as string)?.split("-").join(" ")} */}
            {Object.keys(ct)
              .filter((key) => ct[key])
              .join(", ")}
          </p>
        </div>
        {/* {isArtist && (
          <div className="flex gap-2">
            <CustomRating count={1} />
            {artist?.rating}
          </div>
        )} */}
        {isOwn && (
          <Button
            onClick={() => {
              router.push(`/edit/${slug}`)
            }}
            className="w-full py-2"
          >
            Edit Profile
          </Button>
        )}
        {isArtist && isOwn && (
          <Button
            onClick={() => {
              router.push(`/edit/${slug}/plan`)
            }}
            className="w-full py-2"
          >
            Edit Plan
          </Button>
        )}
      </div>
      {artist?.bio ? (
        <div className="w-11/12 min-w-[280px] break-all border-y border-solid border-secondary-white py-2 text-center">
          {artist?.bio}
        </div>
      ) : (
        <></>
      )}
      {artistHasSocials ? (
        <div className="flex gap-4">
          <div className="flex items-center gap-6">
            {artist?.instagram ? (
              <Image
                src={InstagramIcon}
                className="cursor-pointer opacity-75 transition-all hover:opacity-100"
                width={30}
                height={30}
                alt=""
                onClick={() => window.open(`https://instagram.com/${artist?.instagram}`)}
              />
            ) : (
              <></>
            )}
            {artist.facebook ? (
              <Image
                src={GithubIcon}
                className="cursor-pointer opacity-75 transition-all hover:opacity-100"
                width={30}
                height={30}
                alt=""
                onClick={() => window.open(`https://facebook.com/${artist?.facebook}`)}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ArtistDetail
