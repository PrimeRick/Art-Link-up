import React from "react"

import Sidebar from "@/components/chat/chat-sidebar"

interface ChatLayoutProperties {
  children: React.ReactNode
  sidebar?: boolean
  className?: string
  decoration?: string
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  sidebarOpen: boolean
}

const ChatLayout: React.FC<ChatLayoutProperties> = ({
  children,
  className,
  decoration,
  setSidebarOpen,
  sidebarOpen,
  sidebar = true,
}) => {
  return (
    <div
      style={{
        height:
          typeof window !== "undefined"
            ? `calc(100vh - ${document.getElementById("header")?.clientHeight ?? 72}px)`
            : "calc(100vh - 72px)",
      }}
      className={`font-montserrat ${className}`}
    >
      <div className="flex h-full overflow-hidden">
        {sidebar && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

        <div
          style={{
            height:
              typeof window !== "undefined"
                ? `calc(100vh - ${document.getElementById("header")?.clientHeight ?? 72}px)`
                : "calc(100vh - 72px)",
          }}
          className="relative flex h-full flex-1 flex-col overflow-y-auto overflow-x-hidden"
        >
          <main className="flex h-full flex-col flex-wrap gap-4 md:flex-row md:gap-2 lg:flex-nowrap">
            <div
              className={`flex h-full w-full flex-col sm:mx-auto md:max-w-screen-2xl ${decoration}`}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ChatLayout
