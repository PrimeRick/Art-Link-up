import React from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import PricingPlans from "../ui/pricing-plan"

import ArtistAbout from "./artist-about"
import ArtistBox from "./artist-box"
import ArtistDetail from "./artist-detail"

interface ArtistProfileProps {
  artist: Allow
  isOwn?: boolean
  slug: string
  isArtist: boolean
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({ artist, isOwn, slug, isArtist }) => {
  const plan = artist.Package
  const session = useSession()
  const router = useRouter()
  let ps = (plan ?? []).map((p: Allow) => {
    return {
      x: p?.name,
      name: p.actualname ?? "",
      price: p.price ?? 20,
      currency: "$",
      description: p.description ?? "",
      deliveryTime: p.totalDays + " days" ?? "",
      revisions: p.totalRevisions + " revisions" ?? "",
      features: ["Feature 1", "Feature 2", "Feature 3"],
    }
  })
  ps = ["BASIC_PLAN", "STANDARD", "PREMIUM"].map((name) => ps.find((p: Allow) => p.x === name))

  return (
    <div className="mx-auto px-2 md:py-12 lg:max-w-7xl">
      <div className="flex flex-col items-start gap-6 md:flex-row md:gap-20">
        <div className="center min-w-[250px] flex-col gap-2 md:gap-8">
          <ArtistDetail isOwn={isOwn} artist={artist} slug={slug} isArtist={isArtist} />
          <ArtistBox artist={artist} isOwn={isOwn} isArtist={isArtist} />
        </div>
        <div className="flex max-w-full flex-col gap-2 md:max-w-4xl md:grow md:gap-8">
          <ArtistAbout artist={artist} isArtist={isArtist} />
          {isArtist && !!ps[0]?.name?.length && (
            <PricingPlans
              plans={ps}
              cta={{
                text: "Order Commission",
                onClick: () => {
                  router.push(`/commissions/order/${artist?.id}`)
                },
              }}
              isButtonVisible={
                session.status == "authenticated"
                  ? session.data?.user?.email == "CLIENT"
                    ? true
                    : false
                  : true
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtistProfile
