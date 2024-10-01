import React, { useEffect, useState } from "react"
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

import { getSession } from "@/lib/auth"
import { fetchData, fetchWithoutAuthorization } from "@/utils"

import ArtistAvatar from "@/components/artist/artist-avatar"
import DeleteIcon from "@/components/icons/deleteicon"
import MainLayout from "@/components/layout/layouts/main"
import Button from "@/components/ui/button"
import CustomRating from "@/components/ui/rating"
import Searchbar from "@/components/ui/searchbar"

const AdminPage = ({ Artists, Clients, Admins }: Allow) => {
  const router = useRouter()
  const session = useSession()
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      const searchedArtists = Artists.filter((artist: Allow) => {
        // console.log("check ",artist)
        return artist.first_name.includes(e.target.value)
      })
      setsearchArtists(searchedArtists)
    } else {
      setsearchArtists(Artists)
    }
  }
  const handleClientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      const searchedClients = Clients.filter((client: Allow) => {
        return client.first_name.includes(e.target.value)
      })
      setsearchClients(searchedClients)
    } else {
      setsearchClients(Clients)
    }
  }
  const [searchArtists, setsearchArtists] = useState(Artists)
  const [searchClients, setsearchClients] = useState(Clients)
  useEffect(() => {
    if (router.query.artist !== undefined) {
      const artist = Artists.filter((artist: Allow) =>
        artist.first_name.includes(router.query.artist)
      )
      setsearchArtists(artist)
    }
  }, [router.query])

  async function removeUser(id: string) {
    const res = await fetchData(
      `/v1/users/delete/${id}`,
      session.data?.user?.name as string,
      "DELETE"
    )
    if (res?.error) {
      toast.error("Error deleting user")
    } else {
      toast.success("User deleted Successfully")
      router.reload()
    }
  }
  async function removeAdmin(id: string) {
    const res = await fetchData(
      `/v1/users/admin/delete/${id}`,
      session.data?.user?.name as string,
      "DELETE"
    )
    if (res?.error) {
      toast.error("Error deleting user")
    } else {
      toast.success("User deleted Successfully")
      router.reload()
    }
  }
  return (
    <MainLayout>
      <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:max-w-6xl lg:grid-cols-3">
        {session.data?.user?.email !== "SUPER_ADMIN" && (
          <Searchbar className="w-full" variant="primary" searchArtist={(e) => handleSearch(e)} />
        )}
        <Button
          className="px-4 py-2"
          onClick={() => {
            router.push("/auth/signup/artist")
          }}
        >
          Create a new Artist
        </Button>
        {session && session?.data?.user?.email == "SUPER_ADMIN" && (
          <Button
            className="px-4 py-2"
            onClick={() => {
              router.push("/auth/signup/admin")
            }}
          >
            Create a new Admin
          </Button>
        )}
        <Button
          className="px-4 py-2"
          onClick={() => {
            router.push("/admin/list")
          }}
        >
          View Commissions
        </Button>
      </div>
      {session && session?.data?.user?.email == "SUPER_ADMIN" && (
        <>
          <h1 className="px-8 py-2">Admins</h1>
          <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:max-w-6xl lg:grid-cols-3">
            {(Admins ?? []).map((data: Allow, key: Allow) => (
              <div
                key={key}
                className="relative flex flex-col justify-between space-y-4 rounded-md p-2 shadow-md"
              >
                <div className="flex flex-col gap-2 md:flex-row">
                  <div className="h-20 w-20">
                    <ArtistAvatar url={data?.profileImage} />
                  </div>
                  <div className="md:w-[75%]">
                    <h2 className="text-lg">
                      {data?.first_name} {data?.last_name}
                    </h2>
                    <p className="line-clamp-2 break-all text-sm text-primary-gray/75">
                      {data?.headline}
                    </p>
                  </div>
                </div>
                <p className="line-clamp-3 break-all px-2 font-normal tracking-wide text-primary-gray/50">
                  {data?.bio}
                </p>
                <Button
                  variant="primary"
                  className="w-full py-2"
                  onClick={() => {
                    router.push(`/a/${data?.id}`)
                  }}
                >
                  View Profile
                </Button>
                <DeleteIcon
                  className="absolute right-4 top-2 h-[28px] w-[28px] rounded-md bg-[#00000080] fill-red-300 pt-[2px] transition duration-200 hover:cursor-pointer hover:fill-red-500"
                  onClick={() => {
                    removeAdmin(data?.id)
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
      <h1 className="px-8 py-2">Artists</h1>

      <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:max-w-6xl lg:grid-cols-3">
        {(searchArtists ?? []).map((data: Allow, key: Allow) => (
          <div
            key={key}
            className="relative mb-16 flex flex-col justify-between space-y-4 rounded-md p-2 shadow-md"
          >
            {/* {!!data?.artwork?.length && ( */}
            <Image
              src={
                data?.artwork[0] ||
                "https://cdn.vectorstock.com/i/preview-1x/23/41/default-finance-horizontal-colorful-banner-vector-47152341.jpg"
              }
              className="h-64 w-full rounded-lg "
              alt=""
              height={200}
              width={200}
            />
            {/* )} */}
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="mx-auto h-20 w-20">
                <ArtistAvatar url={data?.profileImage} />
              </div>
              <div className="md:w-[75%] ">
                <h2 className="text-lg">
                  {data?.first_name} {data?.last_name}
                </h2>
                <p className="line-clamp-2 break-all text-sm text-primary-gray/75">
                  {data?.headline}
                </p>
                <CustomRating count={data?.rating} />
              </div>
            </div>
            <p className="line-clamp-3 break-all px-2 font-normal tracking-wide text-primary-gray/50">
              {data?.bio}
            </p>
            <Button
              variant="primary"
              className="w-full py-2"
              onClick={() => {
                router.push(`/a/${data?.id}`)
              }}
            >
              View Profile
            </Button>
            <DeleteIcon
              className="absolute right-4 top-2 h-[28px] w-[28px] rounded-md bg-[#00000080] fill-red-300 pt-[2px] transition duration-200 hover:cursor-pointer hover:fill-red-500"
              onClick={() => {
                removeUser(data?.id)
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center md:flex-row md:gap-4 ">
        <h1 className="px-8 py-2 ">Clients</h1>
        <Searchbar
          className="w-full md:w-1/2"
          variant="primary"
          searchArtist={(e) => handleClientSearch(e)}
          placeHolder="Search Clients...."
        />
      </div>

      <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:max-w-6xl lg:grid-cols-3">
        {(searchClients ?? []).map((data: Allow, key: Allow) => (
          <div
            key={key}
            className="relative flex flex-col justify-between space-y-4 rounded-md p-2 shadow-md"
          >
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="h-20 w-20 ">
                <ArtistAvatar url={data?.profileImage} />
              </div>
              <div className="md:w-[75%]">
                <h2 className="text-lg">
                  {data?.first_name} {data?.last_name}
                </h2>
                <p className="line-clamp-2 break-all text-sm text-primary-gray/75 ">
                  {data?.headline}
                </p>
                <CustomRating count={data?.rating} />
              </div>
            </div>
            <p className="line-clamp-3 break-all px-2 font-normal tracking-wide text-primary-gray/50">
              {data?.bio}
            </p>
            <Button
              variant="primary"
              className="w-full py-2"
              onClick={() => {
                router.push(`/a/${data?.id}`)
              }}
            >
              View Profile
            </Button>
            <DeleteIcon
              className="absolute right-4 top-2 h-[28px] w-[28px] rounded-md bg-[#00000080] fill-red-300 pt-[2px] transition duration-200 hover:cursor-pointer hover:fill-red-500"
              onClick={() => {
                removeUser(data?.id)
              }}
            />
          </div>
        ))}
      </div>
    </MainLayout>
  )
}

export default AdminPage
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req as NextApiRequest, res as NextApiResponse)
  if (!session || !(session.user?.email == "ADMIN" || session.user?.email == "SUPER_ADMIN")) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    }
  }
  let Artists
  const response = await fetchWithoutAuthorization(`/v1/users/artists`, "GET")
  if (response?.error) {
    Artists = []
  } else {
    Artists = response?.data?.users
  }
  // console.log("allartists dasta ", Artists)
  let Clients
  const response2 = await fetchWithoutAuthorization(`/v1/users/clients`, "GET")
  if (response2?.error) {
    Clients = []
  } else {
    Clients = response2?.data?.users
  }
  let Admins
  if (session.user?.email == "SUPER_ADMIN") {
    const response3 = await fetchWithoutAuthorization(`/v1/users/admins`, "GET")
    if (response3?.error) {
      Admins = []
    } else {
      Admins = response3?.data?.users
    }
  } else {
    Admins = []
  }
  return {
    props: {
      Artists,
      Clients,
      Admins,
    },
  }
}
