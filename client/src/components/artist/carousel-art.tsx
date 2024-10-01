import React from "react"
import Image from "next/image"
import { Carousel } from "react-responsive-carousel"

interface CarouselArtworksProps {
  artwork: string[]
}

const CarouselArtworks: React.FC<CarouselArtworksProps> = ({ artwork }) => {
  console.log(artwork)
  return (
    <div className=" px-2 py-4 md:w-[42%] lg:max-w-7xl">
      <Carousel
        showStatus={true}
        infiniteLoop={true}
        centerMode={true}
        showThumbs={false}
        showArrows={true}
        showIndicators={false}
        useKeyboardArrows={true}
        dynamicHeight={true}
        autoPlay={true}
        centerSlidePercentage={40}
        interval={2000}
      >
        {artwork.map((item, i) => (
          <div key={i} className="mx-auto h-[130px] w-[80%] md:h-[200px]">
            <Image
              src={item}
              height={200}
              width={200}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default CarouselArtworks
