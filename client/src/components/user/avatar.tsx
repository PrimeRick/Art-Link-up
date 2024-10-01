import React from "react"
import clsx from "clsx"
import Image from "next/image"

interface UserAvatarProps {
  className?: string
  profileImage?: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ className, profileImage }) => {
  return (
    <div className={clsx("h-10 w-10 overflow-hidden rounded-full", className)}>
      {profileImage ? (
        <Image
          src={profileImage}
          alt="h-full w-full"
          className="h-full w-full"
          height={200}
          width={200}
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-gray-400/50" />
      )}
    </div>
  )
}

export default UserAvatar
