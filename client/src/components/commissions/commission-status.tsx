import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"

import SuccessImage from "@/assets/image/success.png"
import ReturnIcon from "@/assets/svg/icons/return.icon.svg"
import { useUserContext } from "@/providers/user-context"

import Button from "../ui/button"

interface CommissionStatusProps {
  status: "success" | "failure"
}

const CommissionStatus: React.FC<CommissionStatusProps> = ({ status }) => {
  // const x = useSearchParams()
  const router = useRouter()
  const { chatUrl } = router.query
  const user = useUserContext()
  // console.log("first", chatUrl)
  return (
    <div className="center mt-6 h-full w-full flex-col space-y-6 text-center">
      <h2>Commission {status === "success" ? "Ordered" : "Ordering failed"}!</h2>
      {/* Placeholder for symbol */}
      <div className="center h-64 w-64 border border-solid border-red-500">
        <Image src={SuccessImage} alt="" className="h-full w-full" height={200} width={200} />
      </div>
      <h3>{status === "success" ? "Yayy ! Your commission has been successfully accepted" : ""}</h3>
      <p className="max-w-5xl tracking-wide">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      {status === "success" ? (
        <Button
          variant="secondary"
          className="bg-primary-black px-10 py-1 text-primary-white"
          onClick={() => {
            if (chatUrl) {
              router.push(chatUrl as string)
            } else {
              router.push(`/commissions/${user?.user?.id}`)
            }
          }}
        >
          Chat Room
        </Button>
      ) : (
        <Button variant="secondary" className="bg-primary-black px-10 py-1 text-primary-white">
          Try Again
        </Button>
      )}
      <Button variant="link" className="center gap-2 shadow-none">
        <Image src={ReturnIcon} width={10} height={10} className="" alt="" />
        Return to Home
      </Button>
    </div>
  )
}

export default CommissionStatus
