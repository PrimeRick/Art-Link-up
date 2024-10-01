import React from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import Button from "../ui/button"
import PricingPlans from "../ui/pricing-plan"

// import CustomRating from "../ui/rating"
import ArtistAvatar from "./artist-avatar"
import CarouselArtworks from "./carousel-art"

const ArtistDisplay = ({ Artist }: { Artist: Allow }) => {
  // console.log("this is artist ", Artist.Package)
  const plan = Artist.Package
  let ps = plan?.map((p: Allow) => {
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

  const router = useRouter()
  const session = useSession()

  const ct = Artist?.category ? JSON.parse(Artist?.category) : {}

  // console.log("thst srtist ", Artist)
  // console.log("thst srtist ", ps2)
  console.log(session)
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col items-center justify-between gap-4  space-y-1 md:flex-row md:gap-8 md:space-y-4">
        <div className="flex items-center gap-4 pt-4 ">
          <div className="aspect-square h-24 w-24 md:h-48 md:w-48">
            <ArtistAvatar url={Artist?.image} />
          </div>
          <div className="flex max-w-[500px] flex-col items-center">
            <div className="center gap-4">
              <h2 className="text-center">{Artist?.name}</h2>
            </div>
            {/* <div className="flex gap-2">
              <CustomRating count={1} />
              {Artist?.rating}
            </div> */}
            <p className="text-sm text-secondary-gray">
              {Object.keys(ct)
                .filter((key) => ct[key])
                .join(", ")}
              {/* {(Artist?.category as string)?.split("-").join(" ")} */}
            </p>
            {/* <p className="text-sm text-secondary-gray">{Artist?.email}</p> */}
            <div className="py-2">{Artist?.headline}</div>
            <Button
              variant="secondary"
              className="bg-primary-black px-4 py-1 text-primary-white"
              onClick={() => {
                router.push(`/a/${Artist?.id}`)
              }}
            >
              View Profile
            </Button>
            <p className="mt-4 line-clamp-2 max-w-md text-sm text-secondary-gray/75">
              {Artist?.bio}
            </p>
          </div>
        </div>

        {Artist?.artwork && (
          <>
            <CarouselArtworks artwork={Artist?.artwork} />
          </>
        )}

        {plan.length > 0 && (
          <div className="flex min-w-[350px] max-w-lg items-start justify-start overflow-hidden whitespace-nowrap md:min-w-[320px]">
            <PricingPlans
              className="w-full scale-90"
              plans={ps}
              cta={{
                text: "Order Commission",
                onClick: () => {
                  router.push(`/commissions/order/${Artist?.id}`)
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
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtistDisplay
