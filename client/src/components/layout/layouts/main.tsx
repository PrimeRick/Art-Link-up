import React from "react"
import clsx from "clsx"
import { useSession } from "next-auth/react"
import { GridLoader } from "react-spinners"

import ProfilePhotoFallback from "@/assets/svg/fallback/profile.svg"

import Footer from "../footer"
import Header from "../header"

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
  parentContainerClassName?: string
  header?: boolean
  footer?: boolean
  override?: boolean
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  override,
  header = true,
  footer = true,
  parentContainerClassName,
  setSidebarOpen,
}) => {
  const { data: session, status } = useSession()

  if (status === "loading")
    return (
      <div className={clsx("w-full", parentContainerClassName)}>
        {header && (
          <Header authStatus={"loading"} user={undefined} setSidebarOpen={setSidebarOpen} />
        )}
        <main
          className={clsx(
            override
              ? ""
              : "center lg:px-18 xl:px-18 min-h-screen space-y-4 px-4 py-10 md:px-14 md:py-10",
            className
          )}
        >
          <GridLoader
            color="#000000"
            cssOverride={{}}
            loading
            margin={3}
            size={16}
            speedMultiplier={1}
          />
        </main>
        {footer && <Footer />}
      </div>
    )

  return (
    <div className={clsx("w-full", parentContainerClassName)}>
      {header && (
        <Header
          authStatus={status}
          user={
            session?.user
              ? {
                  name: session.user.name ?? "Guest",
                  profileImage: session.user.image ?? ProfilePhotoFallback,
                }
              : undefined
          }
          setSidebarOpen={setSidebarOpen}
        />
      )}
      <main
        className={clsx(
          override ? "" : "min-h-screen space-y-4 px-4 py-10 md:px-16 md:py-10 lg:px-20 xl:px-20",
          className
        )}
      >
        {children}
      </main>
      {footer && <Footer />}
    </div>
  )
}

export default MainLayout
