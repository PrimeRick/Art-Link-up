import React from "react"
import { useRouter } from "next/router"

import Logo from "@/components/ui/logo"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const router = useRouter()
  return (
    <main className="center h-full w-full font-montserrat">
      <div className="center mb-20 mt-12 flex-col space-y-8 sm:mt-8 md:mt-12 lg:mt-20">
        <Logo
          onClick={() => {
            router.push("/")
          }}
          className="cursor-pointer"
        />
        {children}
      </div>
    </main>
  )
}

export default AuthLayout
