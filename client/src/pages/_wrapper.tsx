import React from "react"
import clsx from "clsx"
import { Session } from "next-auth"
import { ToastContainer } from "react-toastify"

import { SocketProvider } from "@/providers/socket-context"
import { UserProvider } from "@/providers/user-context"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Modals from "@/components/modal"

interface WrapperProps {
  children: React.ReactNode
  pageProps: {
    session: Session | null | undefined
    [key: string]: unknown
  }
  className?: string
}

const queryClient = new QueryClient()
const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <SessionProvider session={session}> */}
        <UserProvider>
          <SocketProvider>
            <Modals />
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={false}
              pauseOnHover
              theme="light"
            />
            <main className={clsx("min-h-screen w-full", className)}>{children}</main>
          </SocketProvider>
        </UserProvider>
        {/* </SessionProvider> */}
      </QueryClientProvider>
    </>
  )
}

export default Wrapper
