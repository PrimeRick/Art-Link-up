import React from "react"
import clsx from "clsx"
import Image from "next/image"

import DarkLogoImage from "@/assets/logo/black_logo.png"
import DarkLogoVector from "@/assets/logo/black_logo.svg"
import LightLogoImage from "@/assets/logo/white_logo.png"
import LightLogoVector from "@/assets/logo/white_logo.svg"

interface LogoProps {
  theme?: "light" | "dark"
  className?: string
  imgDecoration?: string
  size?: "sm" | "md" | "lg"
  mode?: "vector" | "img"
  scale?: number
  onClick?: () => void
}

const Logo: React.FC<LogoProps> = ({ className, imgDecoration, mode, onClick, size, theme }) => {
  const dimension = {
    width: size === "sm" ? 60 : size === "md" ? 120 : 260,
    height: size === "sm" ? 60 : size === "md" ? 120 : 260,
  }

  const logo =
    theme === "light" ? (
      <Image
        onClick={onClick}
        src={mode === "img" ? LightLogoImage : LightLogoVector}
        className={clsx(imgDecoration)}
        alt=""
        width={dimension.width}
        height={dimension.height}
      />
    ) : (
      <Image
        onClick={onClick}
        src={mode === "img" ? DarkLogoImage : DarkLogoVector}
        className={clsx(imgDecoration)}
        alt=""
        width={dimension.width}
        height={dimension.height}
      />
    )

  return <div className={className}>{logo}</div>
}

export default Logo
