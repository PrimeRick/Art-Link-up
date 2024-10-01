import React, { useEffect, useState } from "react"
import clsx from "clsx"
// import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { signOut, useSession } from "next-auth/react"
import { MdClose } from "react-icons/md"
import { RxHamburgerMenu } from "react-icons/rx"

// import NotificationIcon from "@/assets/svg/icons/notification.icon.svg"
import layoutData from "@/data/layout.json"
import { useUserContext } from "@/providers/user-context"

import Button from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import Searchbar from "@/components/ui/searchbar"
import UserAvatar from "@/components/user/avatar"

interface HeaderProps {
  className?: string
  authStatus?: "authenticated" | "unauthenticated" | "loading"
  user?: {
    name: string
    profileImage: string
  }
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthButtons = () => {
  const router = useRouter()

  return (
    <div className="center gap-4 whitespace-nowrap">
      <Button
        onClick={() => {
          router.push("/auth/signin")
        }}
        variant="action"
        className="px-4 py-2"
      >
        Login
      </Button>
      <Button
        onClick={() => {
          router.push("/auth/signup")
        }}
        variant="action"
        className="px-4 py-2"
      >
        Sign Up
      </Button>
    </div>
  )
}

const Header: React.FC<HeaderProps> = ({ authStatus, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [enter, setIsEnter] = useState(false)
  const session = useSession()
  const [searchstatement, setsearchStatement] = useState("")
  const closeMenu = () => {
    setIsOpen(false)
  }

  const openMenu = () => {
    setIsOpen(true)
  }
  const ChangeEnter = (x: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("key ", x)
    if (x.key == "Enter") {
      setIsEnter(true)
    } else {
      setIsEnter(false)
    }
  }
  const handleNavSearch = () => {
    if (enter && searchstatement !== "") {
      const path = session.data?.user?.email == "ADMIN" ? "/admin" : "/artists"
      router.push(
        {
          pathname: path,
          query: {
            artist: searchstatement,
          },
        },
        "/artists"
      )
    }
  }
  // Click outside to close menu
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const element = document.getElementById("header")
      if (element) {
        if (!element.contains(event.target as Node)) {
          closeMenu()
        }
      }
    }

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick)
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick)
    }
  }, [isOpen])
  useEffect(() => {
    handleNavSearch()
  }, [enter])
  const userData = useUserContext()
  const { user: Route } = useUserContext()
  return (
    <nav
      id="header"
      className={clsx(
        "flex w-full flex-row items-center justify-between bg-primary-black px-4 py-2 md:px-12",
        className
      )}
    >
      <Logo
        onClick={() => {
          router.push("/")
        }}
        className="cursor-pointer"
        theme="light"
        size="md"
      />
      {/* <button
        key={"open"}
        className="p-2 border border-solid rounded-md border-primary-white md:hidden text-primary-white"
        onClick={() => { setSidebarOpen && setSidebarOpen(true) }}
      >
        open
      </button> */}
      <div className="md:hidden">
        <button
          className="rounded-md border border-solid border-primary-white p-2"
          onClick={openMenu}
        >
          <RxHamburgerMenu className="text-primary-white" />
        </button>
      </div>
      <div
        className={clsx(
          "fixed left-0 top-0 z-50 h-full w-full transform bg-primary-black p-4 opacity-95 transition-transform duration-300 ease-in-out",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
      >
        <div className="absolute top-4 flex gap-2">
          <AuthButtons />
        </div>
        <button
          className="absolute right-4 top-4 rounded-md border border-solid border-primary-white p-2"
          onClick={closeMenu}
        >
          <MdClose className="text-primary-white" />
        </button>
        <div className="flex h-full w-full flex-col items-center justify-evenly py-32">
          {authStatus === "authenticated" && (
            <Link href={`/commissions/${Route?.id}`} className="text-white">
              Commissions
            </Link>
          )}
          {layoutData.header.links.map((link) =>
            link.isAuth ? (
              authStatus === "authenticated" ? (
                <Link
                  href={link.url}
                  key={link.url}
                  className="text-primary-white hover:text-primary-white/75"
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ) : null
            ) : (
              <Link
                href={link.url}
                key={link.url}
                className="text-primary-white hover:text-primary-white/75"
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            )
          )}
          {authStatus === "authenticated" && (
            <Link href={`/chat`} className="text-white">
              Chats
            </Link>
          )}
        </div>
      </div>
      <div className="center hidden gap-10 md:flex">
        {layoutData.header.links.map((link) => (
          <Link
            href={link.url}
            key={link.url}
            className="text-primary-white hover:text-primary-white/75"
          >
            {link.name}
          </Link>
        ))}
        {authStatus === "authenticated" && (
          <Link
            href={`/chat`}
            key={"chat"}
            className="text-primary-white hover:text-primary-white/75"
          >
            Chats
          </Link>
        )}
        {authStatus === "authenticated" && (
          <Link
            href={`/commissions/${Route?.id}`}
            key={"commissions"}
            className="text-primary-white hover:text-primary-white/75"
          >
            Commissions
          </Link>
        )}

        {session &&
          (session.data?.user?.email == "ADMIN" || session.data?.user?.email == "SUPER_ADMIN") && (
            <Link
              href={"/admin"}
              key={"admin"}
              className="text-primary-white hover:text-primary-white/75"
            >
              Admin
            </Link>
          )}
      </div>
      <div className="md:center hidden gap-6">
        <Searchbar
          searchArtist={(e) => setsearchStatement(e.target.value)}
          handleEnter={(e) => ChangeEnter(e)}
        />
        {authStatus === "loading" ? (
          <button className="h-10 w-44 animate-pulse rounded-lg bg-gray-500"></button>
        ) : authStatus === "authenticated" ? (
          <div className="center gap-4">
            <button className="text-primary-white " onClick={() => signOut()}>
              Logout
            </button>
            <button
              onClick={() => {
                router.push(`/a/${userData.user?.id}`)
              }}
              className=""
            >
              <UserAvatar profileImage={userData?.user?.profileImage as string} />
            </button>
          </div>
        ) : (
          <>
            <AuthButtons />
          </>
        )}
      </div>
    </nav>
  )
}

export default Header
