import React from "react"
import clsx from "clsx"
import Marquee from "react-fast-marquee"

interface CustomMarqueeProps {
  autofill?: boolean
  play?: boolean
  pauseOnHover?: boolean
  pauseOnClick?: boolean
  speed?: number
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  loop?: number
  gradient?: boolean
  gradientColor?: string
  gradientWidth?: number
  className?: string
  children: React.ReactNode
}

const CustomMarquee: React.FC<CustomMarqueeProps> = ({
  autofill = false,
  play = true,
  pauseOnHover = true,
  pauseOnClick = false,
  speed = 50,
  direction = "left",
  delay = 0,
  loop = 0,
  gradient = false,
  gradientColor = "#ffffff",
  gradientWidth = 100,
  children,
  className = "",
}) => {
  return (
    <Marquee
      autoFill={autofill}
      play={play}
      pauseOnHover={pauseOnHover}
      pauseOnClick={pauseOnClick}
      speed={speed}
      direction={direction}
      delay={delay}
      className={clsx("", className)}
      loop={loop}
      gradient={gradient}
      gradientColor={gradientColor}
      gradientWidth={`${gradientWidth}px`}
    >
      {children}
    </Marquee>
  )
}

export default CustomMarquee
