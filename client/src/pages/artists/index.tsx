import React, { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

import artistCategories from "@/data/categories.json"
import { fetchWithoutAuthorization } from "@/utils"

import ArtistDisplay from "@/components/artist/artist-display"
import MainLayout from "@/components/layout/layouts/main"
// import Button from "@/components/ui/button"
import Searchbar from "@/components/ui/searchbar"

const Artists = ({ Artists }: { Artists: Allow }) => {
  console.log("this is artist ", Artists)

  const [category, setCategory] = useState<string | null>(null)
  const [init, setInit] = useState<string>("Categories")
  const router = useRouter()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value?.trim() !== "") {
      const searchedArtists = artists.filter((artist: Allow) =>
        artist.name.includes((e.target.value ?? "")?.trim())
      )
      setsearchArtists(searchedArtists)
    } else {
      setsearchArtists(artists)
    }
  }

  const artists = Artists ?? []

  const [searchArtists, setsearchArtists] = useState(artists)

  useEffect(() => {
    if (router.query.artist !== "" && router.query.artist !== undefined) {
      const artist = artists.filter((artist: Allow) => artist.name.includes(router.query.artist))
      setsearchArtists(artist)
    }
  }, [router.query])

  return (
    <MainLayout>
      <div className="center mx-auto w-full max-w-4xl flex-col items-stretch gap-4 md:flex-row">
        <Searchbar className="w-full" variant="primary" searchArtist={(e) => handleSearch(e)} />
        <div className="rounded-md bg-primary-black text-primary-white shadow-2xl hover:bg-primary-black/80 disabled:cursor-not-allowed disabled:bg-black/75 ">
          <select
            id="dropdown"
            onChange={(e) => {
              if (e.target.value === "") {
                setCategory(null)
                return
              }
              setCategory(e.target.value)
            }}
            className="block w-full rounded-md border-none bg-transparent px-3 py-2 text-base text-primary-white outline-none focus:outline-none focus:ring-0 md:min-w-[180px] "
          >
            <option value="" className="text-black" onClick={() => setInit("Everything")}>
              {init}
            </option>
            {artistCategories.artist.map((option) => (
              <option
                className="text-black"
                key={option}
                value={option.toLowerCase().split(" ").join("-")}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex w-full flex-col gap-8">
        {(searchArtists ?? [])
          .filter((artist: Allow) => {
            if (category) {
              if (!artist?.category) return false
              return JSON.parse(artist?.category ?? "{}")[category]
            }
            return true
          })
          .filter(
            (artist: Allow) =>
              artist?.Package &&
              artist?.Package?.length > 0 &&
              artist?.artwork?.length > 0 &&
              artist?.bio &&
              artist?.headline
          )
          .map((Artist: Allow, idx: number) => {
            return <ArtistDisplay Artist={Artist} key={idx} />
          })}
      </div>
    </MainLayout>
  )
}

export default Artists

export const getServerSideProps: GetServerSideProps = async () => {
  let Artists
  Artists = await fetchWithoutAuthorization(`/v1/users/artists`, "GET")
  console.log(Artists)
  if (Artists?.error) {
    return {
      notFound: true,
    }
  }
  Artists = Artists?.data.users

  let users: Allow = Artists

  users = Artists.map((user: Allow) => {
    return {
      id: user?.id,
      name: `${user?.first_name} ${user?.last_name}`,
      username: user?.username ?? "",
      image: user?.profileImage ?? "",
      email: user?.email ?? "",
      category: user?.category ?? "",
      // phone: user?.phone ?? "",
      bio: user?.bio ?? "",
      work: user?.work ?? "",
      socials: {
        instagram: user?.instagram ?? "",
      },
      rating: user?.rating ?? "",
      headline: user?.headline ?? "",
      Package: user.Package,
      artwork: user?.artwork,
    }
  })
  return {
    props: {
      Artists: users,
    },
  }
}
