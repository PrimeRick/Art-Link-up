import { useEffect } from "react"
import { useSession } from "next-auth/react"

// import { useAuth } from "../contexts/AuthContext";
import { axiosPrivate } from "@/lib/axios"
import { useUserContext } from "@/providers/user-context"

const useAxiosPrivate = () => {
  const { user } = useUserContext()
  const { data: session } = useSession()

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${session?.user?.name}`
        }
        return config
      },
      (err) => Promise.reject(err)
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
    }
  }, [user])

  return axiosPrivate
}

export default useAxiosPrivate
