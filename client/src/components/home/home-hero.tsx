import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"

import HomeBannerImage from "@/assets/image/home/banner.jpeg"
import HomeFloatingImage from "@/assets/image/home/float.jpeg"

import Button from "../ui/button"

const HomeHero = () => {
  const router = useRouter()
  return (
    <div className="relative flex flex-row py-32 sm:py-16 lg:pb-0 lg:pt-0">
      <div className="relative mx-auto flex max-w-xl flex-row items-center gap-32 px-4 md:px-0 lg:max-w-screen-xl lg:px-8">
        <div className="relative mb-16 lg:my-40 lg:max-w-xl lg:pr-5">
          <div className="absolute -top-36 right-10 -z-[1] h-[24rem] w-[18rem]">
            <Image
              className="h-56 w-full rounded object-cover shadow-lg md:h-96 lg:h-full lg:rounded-none lg:shadow-none"
              src={HomeFloatingImage}
              alt=""
              height={200}
              width={200}
              priority={true}
            />
          </div>
          <p className="bg-teal-accent-400 mb-4 inline-block rounded-full px-3 py-px text-xs font-semibold uppercase tracking-wider text-teal-900">
            Something here
          </p>
          <h2 className="mb-5 text-4xl tracking-wide text-primary-black sm:text-8xl sm:leading-none">
            What do
            <br /> we do?
          </h2>
          <p className="mb-5 pr-5 text-base text-primary-gray md:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur
          </p>
          <div className="flex items-center">
            <Button
              onClick={() => {
                router.push("/artists")
              }}
              className="bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline mr-6 inline-flex h-12 items-center justify-center rounded px-6 font-medium tracking-wide text-white shadow-md transition duration-200 focus:outline-none"
            >
              Get started
            </Button>
          </div>
        </div>
        <div className="relative h-[30rem] w-[30rem]">
          <Image
            className="h-56 w-full rounded object-cover shadow-lg md:h-96 lg:h-full lg:rounded-none lg:shadow-none"
            src={HomeBannerImage}
            alt=""
            priority={true}
          />
        </div>
      </div>
    </div>
  )
}

export default HomeHero
