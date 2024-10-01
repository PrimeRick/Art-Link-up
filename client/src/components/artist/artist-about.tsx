import React from "react"

import RichText from "../ui/rich-text"

interface ArtistAboutProps {
  artist: ExtendedArtist
  isArtist: boolean
}
const ArtistAbout: React.FC<ArtistAboutProps> = ({ artist, isArtist }) => {
  return (
    <div className="flex w-full flex-col justify-between space-y-4 rounded-sm border border-solid border-secondary-white px-6 py-8">
      {isArtist ? (
        <RichText
          content={[
            {
              type: "h3",
              content: "About the Artist",
              className: "font-bold text-2xl",
            },
            {
              type: "p",
              content: artist.headline || "No content Yet...",
              className: "font-extralight text-base break-all",
            },
            {
              type: "h3",
              content: "Commission Sheet",
              className: "font-bold text-2xl",
            },
            {
              type: "strong",
              content: artist?.work || "No content Yet...",
              className: "font-extralight text-base break-all",
            },
          ]}
        />
      ) : (
        <RichText
          content={[
            {
              type: "h3",
              content: "About you",
              className: "font-extralight text-base break-all",
            },
            {
              type: "p",
              content: artist?.headline || "No content Yet...",
              className: "font-extralight text-base break-all",
            },
          ]}
        />
      )}
    </div>
  )
}

export default ArtistAbout
