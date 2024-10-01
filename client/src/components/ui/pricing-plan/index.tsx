import React, { useState } from "react"
import clsx from "clsx"
import Image from "next/image"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

import RevisionIcon from "@/assets/svg/icons/revision.icon.svg"
import TimeIcon from "@/assets/svg/icons/time.icon.svg"

import Button from "../button"
import RichText from "../rich-text"

interface PricingPlansProps {
  className?: string
  plans: Array<{
    name: string
    price: number
    currency: string
    description: string
    deliveryTime: string
    revisions: string
  }>
  cta: {
    text: string
    onClick: () => void
  }
  onChange?: (x: number) => void
  isButtonVisible?: boolean
}

const PricingPlans: React.FC<PricingPlansProps> = ({
  cta,
  className,
  plans,
  onChange,
  isButtonVisible,
}) => {
  const [active, setActive] = useState(0)
  const session = useSession()
  const router = useRouter()

  return (
    <div
      className={clsx("space-y-4 rounded-sm border border-solid border-secondary-white", className)}
    >
      {!!plans.length && (
        <>
          <div className="flex w-full items-center justify-between ">
            {plans.map((plan) => {
              const key = plan?.name?.toLowerCase().split(" ").join("-")
              return (
                <button
                  onClick={() => {
                    setActive(plans.indexOf(plan))
                    onChange && onChange(plans.indexOf(plan))
                  }}
                  className={clsx(
                    "line-clamp-3 grow border border-solid border-secondary-white py-4 text-center hover:bg-primary-black hover:text-primary-white",
                    active === plans?.indexOf(plan) && "bg-primary-black text-primary-white"
                  )}
                  key={key}
                >
                  {plan?.name}
                </button>
              )
            })}
          </div>
          <div className="flex w-full flex-col px-6 pb-4 ">
            <RichText
              content={[
                {
                  type: "h3",
                  content: `${plans[active]?.currency ?? "$"} ${plans[active]?.price ?? "0"}`,
                },
                {
                  type: "html",
                  content: plans[active]?.description ?? "null",
                  className: "text-primary-gray/50 text-sm w-full overflow-wrap line-clamp-3 ",
                },
              ]}
            />
            <div className="flex flex-wrap items-center justify-evenly gap-1 md:gap-2  ">
              <div className="flow-row flex w-14 items-center gap-2 text-primary-gray md:w-24 ">
                <Image src={TimeIcon} className="" width={18} height={18} alt="" />
                {plans[active]?.deliveryTime === "undefined"
                  ? ""
                  : plans[active]?.deliveryTime ?? ""}
              </div>
              <div className="flow-row flex w-14 items-center gap-2 text-primary-gray md:w-28">
                <Image src={RevisionIcon} className="" width={18} height={18} alt="" />
                {plans[active]?.revisions === "undefined" ? "" : plans[active]?.revisions ?? ""}
              </div>
            </div>
          </div>
          {!isButtonVisible ? null : (
            <>
              {" "}
              <Button
                className="w-full rounded-none py-4"
                onClick={() => {
                  if (session.status == "unauthenticated") {
                    toast.error("Please Login to Order")
                    router.push("/auth/signin")
                  } else {
                    cta.onClick()
                  }
                }}
              >
                {cta.text}
              </Button>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default PricingPlans
