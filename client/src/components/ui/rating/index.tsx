import React from "react"
import clsx from "clsx"
import Image from "next/image"

import StarIcon from "@/assets/svg/icons/star.icon.svg"

interface CustomRatingProps {
  animation?: boolean
  count?: number
  disabled?: boolean
  filled?: number
  initialBounce?: boolean
  wrapperClassName?: string
  onChange?: (value: number) => void
  width?: number
  height?: number
}

const CustomRating: React.FC<CustomRatingProps> = ({
  count = 5,
  wrapperClassName = "",
  width = 24,
  height = 24,
}) => {
  return (
    <div className={clsx("flex h-min gap-2", { [wrapperClassName]: wrapperClassName })}>
      {Array.from({ length: count }, (_, index: number) => (
        <Image src={StarIcon} alt="" key={index} width={width} height={height} />
      ))}
    </div>
  )
}

export default CustomRating
