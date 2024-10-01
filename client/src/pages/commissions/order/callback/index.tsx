import React, { useEffect } from "react"
import { useRouter } from "next/router"

const Index = () => {
  const router = useRouter()
  useEffect(() => {
    router.back()
  }, [])
  return <></>
}

export default Index
