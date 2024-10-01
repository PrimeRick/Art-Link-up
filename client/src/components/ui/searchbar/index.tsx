import React from "react"
import clsx from "clsx"
import Image from "next/image"

import SearchIcon from "@/assets/svg/icons/search.icon.svg"

const variants = {
  default: {
    container: "gap-4 rounded-md border border-solid border-primary-white ",
    input:
      "rounded border border-none bg-transparent p-2 text-primary-white outline-none placeholder:text-sm placeholder:font-light placeholder:text-primary-white",
    button: "",
  },
  primary: {
    container: "",
    input: "shadow-md rounded-l-md p-2 px-6",
    button: "shadow-md bg-primary-black hover:bg-primary-black/75 rounded-r-md py-3 px-6",
  },
  secondary: {
    container: "",
    input: "",
    button: "",
  },
}

interface SearchbarProps {
  variant?: "default" | "primary" | "secondary"
  className?: string
  searchArtist: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeHolder?: string
}

const Searchbar: React.FC<SearchbarProps> = ({
  variant = "default",
  className,
  searchArtist,
  handleEnter,
  placeHolder,
}) => {
  return (
    <div className={clsx("center h-min w-full md:px-4", variants[variant].container, className)}>
      <input
        type="text"
        placeholder={placeHolder ?? "Search an artist..."}
        className={clsx("w-full outline-none ring-0 transition-all", variants[variant].input)}
        onChange={(e) => {
          searchArtist(e)
        }}
        onKeyDown={(e) => handleEnter && handleEnter(e)}
      />
      <button className={clsx("transition-all", variants[variant].button)}>
        <Image src={SearchIcon} className="" width={16} height={16} alt="" />
      </button>
    </div>
  )
}

export default Searchbar
