import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { signIn, SignInAuthorizationParams, useSession } from "next-auth/react"
import { toast } from "react-toastify"

import { fetchData, fetchWithoutAuthorization } from "@/utils"
import generateUsername from "@/utils/generate-username"

export type SignUpDataProps = {
  firstName: string
  lastName: string
  email: string
  password: string
  isArtist: boolean
}
export type SignUpAdminProps = {
  firstName: string
  lastName: string
  email: string
  password: string
}
interface EditDataProps {
  headline: string
  location: string
  instagram: string
  facebook: string
  twitter: string
  youtube: string
  twitch: string
  spotify: string
  soundcloud: string
  category: string
  website: string
  bio: string
  work: string
  isArtist: boolean
}

export type SignInDataProps = {
  email: string
  password: string
}
export type IEditPlanData = {
  packageId?: string
  totalRevisions: number
  totalDays: number
  price: number
  name: string
  description: string
  isArtist: boolean
  isUpdate: boolean
  actualName: string
}
export type EditDataPlanProps = Array<IEditPlanData>
interface IUserContext {
  handleSignin: (
    data: SignInDataProps,
    params?: SignInAuthorizationParams
  ) => Promise<InternalResponse>
  handleSignup: (data: SignUpDataProps) => Promise<InternalResponse>
  handleAdminCreate: (data: SignUpAdminProps) => Promise<InternalResponse>
  handleEdit: (data: EditDataProps) => Promise<InternalResponse>
  handleEditPlan: (data: EditDataPlanProps) => Promise<InternalResponse>

  user: Allow | null
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
}

interface IUserProvider {
  children: React.ReactNode
}

const Context = React.createContext<IUserContext>({} as IUserContext)

const UserProvider = ({ children }: IUserProvider) => {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()

  const [user, setUser] = useState<Artist | null>(null)
  const [status, setStatus] = useState<string>("")
  useEffect(() => {
    if (session?.user?.name && sessionStatus == "authenticated" && session !== undefined) {
      if (sessionStatus == "authenticated") {
        loaddata()
      }
    }
  }, [session, sessionStatus])
  const loaddata = async () => {
    const data = await fetchData("/v1/auth", session?.user?.name as string, "GET")
    if (data?.error) {
      toast.error(data.error)
    }
    setUser(data?.data?.user)
  }

  const handleSignin = async ({ email, password }: SignInDataProps): Promise<InternalResponse> => {
    try {
      const res = await signIn(
        "credentials",
        { email, password, callbackUrl: `${window.location.origin}`, redirect: false }
        // { ...((params ?? {}) as Record<string, string>) }
      )
      if (res?.error) {
        const emessage: string = (await JSON.parse(res?.error)?.message) ?? "Request failed"
        toast.error(emessage)
        return { success: "failure", message: "Something went wrong" }
      } else {
        return { success: "success", message: "Signin success" }
      }
    } catch (error) {
      // console.log("Error signing in", (error as Error)?.message)
      return { success: "failure", message: "Something went wrong" }
    }
  }

  const handleSignup = async ({
    firstName,
    lastName,
    email,
    password,
    // phone,
    isArtist,
  }: SignUpDataProps): Promise<InternalResponse> => {
    try {
      const username = generateUsername(firstName, lastName)
      const route = isArtist ? "/v1/users/artist/create" : "/v1/auth/register"
      let response

      if (isArtist) {
        response = await fetchData(route, session?.user?.name as string, "POST", {
          first_name: firstName,
          last_name: "",
          username,
          email,
          password,
        })
      } else {
        response = await fetchWithoutAuthorization(route, "POST", {
          first_name: firstName,
          last_name: "",
          username,
          email,
          password,
        })
      }

      if (response?.error) {
        toast.error(response.error?.response?.data?.message || response.message)
        return { success: "failure", message: "Something went wrong" }

        // return null;
      } else {
        const data = response?.data
        if (isArtist) {
          toast.success("Artist Created")
          return { success: "success", message: "Success" }
        }
        if (data && !isArtist) {
          const user = data?.user
          if (user) {
            setUser(user)
            const email = user.email
            // const password = user.password
            await signIn("credentials", { email, password, callbackUrl: "/" })
            return { success: "success", message: "Signup success" }
          }

          throw new Error(data?.message)
        }

        throw new Error("Something went wrong")
      }
    } catch (error) {
      // console.log("Error creating user", (error as Error)?.message)
      return { success: "failure", message: "Something went wrong" }
    }
  }

  const handleAdminCreate = async ({
    firstName,
    lastName,
    email,
    password,
  }: SignUpAdminProps): Promise<InternalResponse> => {
    try {
      const username = generateUsername(firstName, lastName)
      const route = "/v1/users/admin/create"
      const response = await fetchData(route, session?.user?.name as string, "POST", {
        first_name: firstName,
        last_name: "",
        username,
        email,
        password,
      })

      if (response?.error) {
        toast.error(response.error?.response?.data?.message || response.message)
        return { success: "failure", message: "Something went wrong" }

        // return null;
      } else {
        toast.success("Admin Created")
        return { success: "success", message: "Success" }
      }
    } catch (error) {
      return { success: "failure", message: "Something went wrong" }
    }
  }

  const handleEdit = async ({
    headline,
    location,
    instagram,
    facebook,
    twitter,
    youtube,
    twitch,
    spotify,
    soundcloud,
    category,
    website,
    bio,
    work,
  }: EditDataProps): Promise<InternalResponse> => {
    try {
      // Assuming you have a userId or some identifier for the user

      const route = `/v1/users/${user?.id}` // Adjust the route according to your backend API
      const response = await fetchData(route, session?.user?.name as string, "PATCH", {
        headline,
        location,
        category,
        instagram,
        facebook,
        twitter,
        youtube,
        twitch,
        spotify,
        soundcloud,
        website,
        bio,
        work,
      })

      if (response?.error) {
        toast.error(response.error?.response?.data?.message || response.message)
        return { success: "failure", message: "Something went wrong" }
      } else {
        const data = response?.data
        if (data) {
          const user = data?.user
          if (user) {
            // Assuming you have a setUser function to update the user in the state
            setUser(user)

            return { success: "success", message: "Profile updated successfully" }
          }

          throw new Error(data?.message)
        }

        throw new Error("Something went wrong")
      }
    } catch (error) {
      console.error("Error updating profile", (error as Error)?.message)
      return { success: "failure", message: "Something went wrong" }
    }
  }
  const handleEditPlan = async (
    editData: EditDataPlanProps
  ): Promise<InternalResponse<unknown, Error | null>> => {
    // console.log(editData)

    try {
      const updatePromises = editData.map(async (d) => {
        const route = d.isUpdate ? `/v1/package/${d.packageId}` : `/v1/package/user`
        const method = d.isUpdate ? "PATCH" : "POST"
        let response
        if (d.isUpdate) {
          response = await fetchData(route, session?.user?.name as string, method, {
            totalRevisions: d.totalRevisions,
            totalDays: d.totalDays,
            price: Number(d.price),
            description: d.description,
            actualname: d.actualName,
          })
        } else {
          response = await fetchData(route, session?.user?.name as string, method, {
            totalRevisions: d.totalRevisions,
            totalDays: d.totalDays,
            price: Number(d.price),
            name: d.name,
            description: d.description,
            actualname: d.actualName,
          })
        }
        console.log("response ", response)
        if (response?.error) {
          toast.error(response.error?.response?.data?.message || response.message)
          return { success: "failure", message: "Something went wrong" }
        } else {
          const data = response?.data
          if (data) {
            const updatedPackage = data?.package
            if (updatedPackage) {
              // Return success if the package is updated successfully
              return { success: "success", message: "Package updated successfully" }
            }
            // console.log("chaling2 ")
            throw new Error("Something went wrong")
          }
          // console.log("chaling3 ")
          throw new Error("Something went wrong")
        }
      })

      // Wait for all promises to resolve
      const results = await Promise.all(updatePromises)
      // console.log("chaling4 ")

      // Check if all updates were successful
      const allSuccess = results.every((result) => result.success === "success")
      // console.log("chaling5 ")

      if (allSuccess) {
        // console.log("chaling6 ")
        toast.success("Plan updated successfully")
        router.push("/")
        return { success: "success", message: "All packages updated successfully" }
      } else {
        // console.log("chaling7 ")

        return { success: "failure", message: "Some packages failed to update" }
      }
    } catch (error) {
      return { success: "failure", message: "Something went wrong" }
    }
  }

  return (
    <Context.Provider
      value={{
        user,
        handleEditPlan,
        handleSignin,
        handleSignup,
        status,
        setStatus,
        handleEdit,
        handleAdminCreate,
      }}
    >
      {children}
    </Context.Provider>
  )
}

const useUserContext = () => {
  const c = React.useContext(Context)

  if (c === undefined) {
    throw new Error("useUserContext must be used within a UserProvider")
  }

  return c
}

export { UserProvider, useUserContext }
