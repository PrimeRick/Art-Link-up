import React from "react"

import CustomMarquee from "../ui/marquee"

const artStyles = [
  "Abstract Art",
  "Classicism",
  "Expressionism",
  "Neon Art",
  "Pop Art",
  "Street Art",
]

const HomeArtStylesOfferings = () => {
  return (
    <div className="center mx-auto my-6 flex-col space-y-12 lg:max-w-screen-xl">
      <h2 className="text-5xl font-bold">Art Styles We Offer</h2>
      <CustomMarquee gradient gradientWidth={360}>
        {artStyles.map((artStyle, index) => {
          return (
            <span key={index} className="mx-12 text-4xl font-light tracking-wide">
              {artStyle}
            </span>
          )
        })}
      </CustomMarquee>
    </div>
  )
}

export default HomeArtStylesOfferings
