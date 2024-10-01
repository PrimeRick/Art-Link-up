import React from "react"
import Link from "next/link"

const Error404Page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 px-6 py-28 md:px-24 md:py-20 lg:flex-row lg:gap-28 lg:py-32">
      <div className="w-full lg:w-1/2">
        <h1 className="py-4 text-3xl font-extrabold text-gray-800 dark:text-white lg:text-4xl">
          Looks like you've found the doorway to the great nothing
        </h1>
        <p className="mb-8 py-4 text-base text-gray-800 dark:text-white">
          The content you’re looking for doesn’t exist. Either it was removed, or you mistyped the
          link
        </p>
        <Link
          href={"/"}
          className="my-20 w-full rounded-md bg-primary-black px-1 py-5 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-black focus:ring-opacity-50 sm:px-16 lg:w-auto"
        >
          Go back to Homepage
        </Link>
      </div>
    </div>
  )
}

export default Error404Page
