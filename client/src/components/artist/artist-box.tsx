import React, { useEffect, useState } from "react"
import { differenceInDays, differenceInMonths } from "date-fns"

interface ArtistBoxProps {
  artist: Artist
  isArtist: boolean
  isOwn: boolean | undefined
}

const ArtistBox: React.FC<ArtistBoxProps> = ({ artist }) => {
  // console.log("why artist box is not being rendered ", artist)
  const [artistDetails, setArtistDetails] = useState<
    Array<{ id: number; title: string; value: string }>
  >([])

  useEffect(() => {
    const details = typeof artistDetails === "undefined" ? [] : artistDetails

    if (artist?.location) details.push({ id: 0, title: "From", value: artist?.location })
    if (artist?.createdAt) {
      const createdAt = new Date(artist.createdAt)
      const currentDate = new Date()
      const diffInMonths = differenceInMonths(currentDate, createdAt)
      const diffInDays = differenceInDays(currentDate, createdAt)
      const value = diffInMonths > 0 ? `${diffInMonths} months` : `${diffInDays} days`
      details.push({ id: 1, title: "Member since", value })
    }
    if (artist?.languages) {
      const languages = artist.languages?.splice(0, 3)?.join(", ")
      details.push({ id: 3, title: "Languages", value: languages })
    }

    setArtistDetails(details)
  }, [artist, artistDetails])

  return artistDetails?.length > 0 ? (
    <div className="flex w-full min-w-[280px] flex-col justify-between space-y-4 rounded-sm border border-solid border-secondary-white px-6 py-8">
      {artistDetails.map((detail) => (
        <div key={detail.id} className="flex justify-between text-sm font-light">
          <div className="flex flex-col">
            <span className="">{detail.title}</span>
          </div>
          <div className="flex items-center">
            <span className="">{detail.value}</span>
          </div>
        </div>
      ))}
    </div>
  ) : null
}

export default ArtistBox
