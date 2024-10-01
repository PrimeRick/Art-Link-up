import React, { useEffect, useState } from "react"
// import { Carousel } from "react-responsive-carousel"
import Lightbox from "yet-another-react-lightbox"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import Inline from "yet-another-react-lightbox/plugins/inline"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"

import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"
interface ArtworksProps {
  artwork: string[]
}

const Artworks: React.FC<ArtworksProps> = ({ artwork }) => {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  const toggleOpen = (state: boolean) => () => setOpen(state)
  //states for full screeen
  const [auto] = React.useState(false)
  const updateIndex = ({ index: current }: { index: number }) => setIndex(current)
  const createSlides = (imageUrls: string[]) => {
    return imageUrls.map((url) => {
      // // You can adjust these values based on your requirements
      // const width = 2000;
      // const height = 1200;
      const width = auto ? 1800 : 1000
      const height = auto ? 1200 : 600

      return {
        src: url,
        width,
        height,
        srcSet: [
          {
            src: url, // You might want to generate different sizes for srcSet
            width,
            height,
          },
        ],
      }
    })
  }
  const [slides, setSlides] = useState(createSlides(artwork))

  // const slides = useMemo(()=>,[artwork,auto]);

  //states for thumbnails
  const [position] = React.useState<"top" | "bottom" | "start" | "end">("bottom")
  const [width] = React.useState(120)
  const [height] = React.useState(80)
  const [border] = React.useState(1)
  const [borderRadius] = React.useState(4)
  const [padding] = React.useState(4)
  const [gap] = React.useState(16)
  const [showToggle] = React.useState(false)

  useEffect(() => {
    setSlides(createSlides(artwork))
  }, [auto])
  // const isFullscreenEnabled = () =>
  //   document.fullscreenEnabled ??
  //   document.webkitFullscreenEnabled ??
  //   document.mozFullScreenEnabled ??
  //   document.msFullscreenEnabled;
  const isMobile = window.innerWidth <= 768 //
  return (
    <div className="mx-auto px-2 py-6 lg:max-w-7xl">
      {/* <Carousel showStatus={false} infiniteLoop={true}>
        {artwork.map((item, i) => (
          <div key={i} className="h-80 w-full bg-gray-100">
            <Image
              src={item}
              alt="artwork"
              height={200}
              width={200}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </Carousel> */}

      <Lightbox
        index={index}
        slides={slides}
        fullscreen={{ auto }}
        plugins={isMobile ? [Inline, Fullscreen] : [Inline, Thumbnails, Fullscreen]}
        on={{
          view: updateIndex,
          click: toggleOpen(true),
        }}
        carousel={{
          padding: 0,
          spacing: 0,
          imageFit: "cover",
        }}
        inline={{
          style: {
            width: "100%",
            // maxWidth: "900px",
            aspectRatio: "3 / 2",
            margin: "0 auto",
          },
        }}
        thumbnails={{
          position,
          width,
          height,
          border,
          borderRadius,
          padding,
          gap,
          showToggle,
        }}
      />

      <Lightbox
        open={open}
        close={toggleOpen(false)}
        fullscreen={{ auto }}
        index={index}
        slides={slides}
        plugins={[Thumbnails, Fullscreen]}
        on={{ view: updateIndex }}
        animation={{ fade: 2 }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        thumbnails={{
          position,
          width,
          height,
          border,
          borderRadius,
          padding,
          gap,
          showToggle,
        }}
      />
    </div>
  )
}

export default Artworks
