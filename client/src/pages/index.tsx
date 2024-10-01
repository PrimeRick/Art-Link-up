import React from "react"
import { GetServerSideProps } from "next"
import { Session } from "next-auth"

import { fetchWithoutAuthorization } from "@/utils"

import HomeArtStylesOfferings from "@/components/home/home-art-styles"
import HomeArtistGrid from "@/components/home/home-artist-grid"
import HomeHero from "@/components/home/home-hero"
import MainLayout from "@/components/layout/layouts/main"

interface HomePageProps {
  session: Session | null
  Artists: Allow
}

const HomePage: React.FC<HomePageProps> = ({ Artists }) => {
  // console.log({ session, status })

  return (
    <MainLayout>
      <HomeHero />
      <HomeArtStylesOfferings />
      <HomeArtistGrid Artists={Artists} />
    </MainLayout>
  )
}

export default HomePage
export const getServerSideProps: GetServerSideProps = async () => {
  let artists = []

  const response = await fetchWithoutAuthorization(`/v1/users/artists`, "GET")
  if (response?.error) {
    artists = []
  }

  artists = response?.data?.users ?? []

  return {
    props: {
      artists,
    },
  }
}
