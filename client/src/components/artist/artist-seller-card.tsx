import React from "react"

import Button from "../ui/button"
import CustomRating from "../ui/rating"

import ArtistAvatar from "./artist-avatar"

const ArtistSellerCard = () => {
  return (
    <>
      <div className="space-y-4 rounded-md p-2 shadow-md">
        <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200/75" />
        <div className="flex gap-2">
          <div className="h-20 w-20">
            <ArtistAvatar url="" />
          </div>
          <div className="">
            <h2 className="text-lg">Artist Name</h2>
            <p className="text-sm text-primary-gray/75">job title</p>
            <CustomRating count={5} />
          </div>
        </div>
        <p className="line-clamp-1 px-2 font-normal tracking-wide text-primary-gray/50">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa rerum soluta ullam
          quibusdam quasi nisi distinctio iste architecto laudantium expedita quis eligendi magni
          fugiat minus, eum iusto exercitationem quod fugit! Iure debitis eius officiis? Molestiae
        </p>
        <Button variant="primary" className="w-full py-2">
          View Profile
        </Button>
      </div>
    </>
  )
}

export default ArtistSellerCard
