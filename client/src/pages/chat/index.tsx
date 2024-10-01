import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import StartConvoBanner from "@/components/chat/chat-start"
import ChatLayout from "@/components/layout/layouts/chat"
import MainLayout from "@/components/layout/layouts/main"

const ChatPage = () => {
  const session = useSession()
  const router = useRouter()
  useEffect(() => {
    if (!session.data?.user?.name) {
      router.push("/?message=Please Authenticate")
    }
  }, [])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <MainLayout
      override
      footer={false}
      parentContainerClassName="relative max-h-screen overflow-hidden"
      setSidebarOpen={setSidebarOpen}
    >
      <ChatLayout
        decoration="bg-secondary-gray h-full"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <StartConvoBanner />
      </ChatLayout>
    </MainLayout>
  )
}

export default ChatPage
