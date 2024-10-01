import React from "react"
import Image from "next/image"

import FallbackProfileImage from "@/assets/svg/fallback/profile.svg"

interface ArtistAvatarProps {
  url: string
}

const ArtistAvatar: React.FC<ArtistAvatarProps> = ({ url }) => {
  // console.log("url coming ", url)
  return url ? (
    <Image
      src={url}
      alt=""
      height={200}
      width={200}
      className="h-full w-full rounded-full"
      priority
    />
  ) : (
    <div className="relative h-full w-full overflow-hidden rounded-full">
      <Image src={FallbackProfileImage} alt="" fill priority />
    </div>
  )
}

export default ArtistAvatar
