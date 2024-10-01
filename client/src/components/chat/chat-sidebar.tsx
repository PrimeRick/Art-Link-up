import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { signOut } from "next-auth/react"
import { ChatList } from "react-chat-elements"
import { FiLogOut } from "react-icons/fi"

import { useGetConversations } from "@/hooks/use-conversations"
import { useUserContext } from "@/providers/user-context"

import ConverasationSkeleton from "../ui/conversationSkeleton"

interface ChatSidebarProperties {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatSidebar: React.FC<ChatSidebarProperties> = ({ sidebarOpen, setSidebarOpen }) => {
  const router = useRouter()
  const { user } = useUserContext()

  const trigger = useRef<React.LegacyRef<HTMLButtonElement>>(null)
  const sidebar = useRef<React.LegacyRef<HTMLElement | null>>(null)
  const { data: conversations, isLoading: isLoadingConversations } = useGetConversations()
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  // const [search, setSearch] = useState("")
  let conversationsContent: JSX.Element[] | undefined = []
  // const clearSearch = () => {
  //   setSearch("")
  // }
  // const handleDivClick = (result: IChatItemProps) => {
  //   newConversation([result.id as string])
  // }
  useEffect(() => {
    const storedSidebarExpanded = window.localStorage.getItem("sidebar-expanded")
    setSidebarExpanded(storedSidebarExpanded === null ? false : storedSidebarExpanded === "true")
  }, [])

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target))
        return
      setSidebarOpen(false)
    }

    document.addEventListener("click", clickHandler)

    return () => document.removeEventListener("click", clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return
      setSidebarOpen(false)
    }

    document.addEventListener("keydown", keyHandler)

    return () => document.removeEventListener("keydown", keyHandler)
  })

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString())

    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded")
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded")
    }
  }, [sidebarExpanded])

  if (isLoadingConversations) {
    const numSkeletonComponents = 6
    for (let i = 0; i < numSkeletonComponents; i++) {
      conversationsContent?.push(<ConverasationSkeleton key={i} />)
    }
  } else {
    conversationsContent = conversations && [
      <ChatList
        key={0}
        id={"commission"}
        lazyLoadingImage="https://via.placeholder.com/100x100"
        dataSource={conversations.map((result) => {
          const x = result.participants[0].username.split(".")
          result.participants[0].username = x[0].trim()
          return {
            id: result.id,
            avatar: result.participants[0].profileImage ?? "https://via.placeholder.com/100x100",
            alt: result.participants[0].id,
            date: result.lastMessageSent?.created_at,
            title: result.participants[0].username,
            subtitle: result.lastMessageSent?.message,
          }
        })}
        onClick={(result) => {
          router.push({
            pathname: "/chat/dev",
            query: {
              id: result.alt,
              title: result.title,
              conversationId: result.id,
              avatar: result.avatar,
            },
          })
        }}
      />,
    ]
  }

  return (
    <aside
      ref={sidebar as React.LegacyRef<HTMLElement> | undefined}
      className={`absolute left-0 top-0 z-[1000] flex h-screen w-60 flex-col overflow-y-scroll bg-primary-white duration-300 ease-linear md:w-full xl:static xl:max-w-[320px] xl:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-1.5 md:ml-[1.5rem] md:px-2 xl:px-0">
        <button
          ref={trigger as React.LegacyRef<HTMLButtonElement> | undefined}
          onClick={() => setSidebarOpen((previous) => !previous)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="text-primary-cool-grey/50 block xl:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scroll flex h-full flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="relative h-full">
          <style>
            {`
              .rce-citem-body--bottom-status span {
                background-color: #000;
              }

              .rce-citem-body--bottom {
                gap: 0.5rem;
              }

              .rce-citem-body--bottom-title {
                font-size: 0.75rem;
                max-width: 80%;
              }
            `}
          </style>
          <div className="flex h-full flex-col gap-1.5">
            <div className="h-[73%] overflow-y-scroll">{conversationsContent}</div>
            {/* <Search search={search} setSearch={setSearch} /> */}
            {/* {

              !searchResults ? (
                conversationsContent?.length === 0 ? (
                  <p className="absolute px-5 text-center -translate-y-1/2 text-neutral-600 dark:text-neutral-500 top-1/2 justify-self-center">
                    Use the search bar above to find users to message.
                  </p>
                ) : (
                  
                )
              ) : searchResults.users.length > 0 ? (
                <>
                  <ChatList
                    id={"commission"}
                    lazyLoadingImage="https://via.placeholder.com/100x100"
                    dataSource={
                      searchResults.users.filter((res) => res.id != user?.id).map((result) => (
                        {
                          id: result.id,
                          avatar: result.profileImage ?? "",
                          alt: "",
                          // date: result.date,
                          title: result.username,



                        }
                      )
                      )}
                    onClick={(result, i, e) => { handleDivClick(result); }}
                  />

                </>
              ) : (
                <h2 className="text-center">No results found</h2>
              )} */}
            <div className="flex  w-[inherit] flex-wrap justify-around gap-1.5">
              <div className="flex items-center gap-2">
                <div className="aspect-square w-12 overflow-hidden rounded-full">
                  <Image
                    src={user?.profileImage || ""}
                    alt=""
                    height={200}
                    width={200}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid items-center">
                  <p className="text-sm leading-4 text-neutral-600 dark:text-neutral-500">
                    @{user?.first_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                name="logout"
                className="h-fit rounded-full bg-neutral-200 p-3 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900"
              >
                <FiLogOut />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default ChatSidebar
