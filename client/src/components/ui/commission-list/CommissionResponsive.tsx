import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

import { useUserContext } from "@/providers/user-context"
import { fetchData } from "@/utils"

import Button from "../button"

interface CommissionCardProps {
  viewMode: "single" | "double"
  commissions: Allow
}

const CommissionResponsive: React.FC<CommissionCardProps> = ({ viewMode, commissions }) => {
  const { user } = useUserContext()
  const router = useRouter()
  const { data: session } = useSession()
  const handlePayout = async (amount: string, email: string, CommissionId: string) => {
    const res = await fetchData(
      "/v1/payment/order/batchPayouts",
      session?.user?.name as string,
      "POST",
      {
        amount,
        email,
        userId: user?.id,
        CommissionId,
      }
    )
    // console.log(res?.data)
    if (res?.error) {
      toast.error(res?.message)
    } else {
      router.push("/admin")
      toast.success(res?.message)
    }
  }
  return (
    <table className="block text-xs sm:text-sm md:hidden">
      <tbody className="font-semibold text-[#000]">
        {(commissions ?? []).map((item: Allow, idx: Allow) => (
          <tr className="border-y hover:shadow-sm" key={idx}>
            <td className="whitespace-nowrap py-2 text-center sm:px-2">
              <div className="flex -space-x-4 rtl:space-x-reverse sm:-space-x-2">
                {/* {item.profile.map((image, key) => {
                  return (
                    <Image
                      key={key}
                      alt=""
                      src={image}
                      width={4}
                      height={4}
                      className="object-cover w-6 h-6 border border-gray-900 rounded-full sm:h-12 sm:w-12"
                    />
                  )
                })} */}
                <Image
                  key={"img1"}
                  alt=""
                  src={item?.profilePicture}
                  width={4}
                  height={4}
                  className="h-6 w-6 rounded-full border border-gray-900 object-cover"
                />

                <Image
                  key={"img2"}
                  alt=""
                  src={item?.clientprofilePicture}
                  width={4}
                  height={4}
                  className="h-6 w-6 rounded-full border border-gray-900 object-cover"
                />
              </div>
            </td>
            <td className="flex flex-col px-4 py-2 sm:px-8">
              <table>
                <tr>
                  <td className="whitespace-nowrap ">Artist :</td>
                  <td className="whitespace-nowrap ">{item?.name}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap ">Customer :</td>
                  <td className="whitespace-nowrap ">{item?.clientName}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap ">Start Date :</td>
                  <td className="whitespace-nowrap ">
                    {new Date(item.startedOn).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap ">End Date :</td>
                  <td className="whitespace-nowrap ">
                    {new Date(item?.endDate).toLocaleDateString()}
                  </td>
                </tr>
              </table>
              {viewMode === "double" && (
                <tr>
                  <td className="whitespace-nowrap font-normal">{item?.email}</td>
                </tr>
              )}
            </td>
            <td className="px-1 py-2 text-center">
              <div className="flex flex-col">
                <Button
                  variant="pill"
                  onClick={() => {
                    const id = user?.id === item?.artistId ? user?.id : item?.artistId
                    const name = item?.name.split(".")
                    router.push({
                      pathname: "/chat/dev",
                      query: {
                        id: id as string,
                        title: name[0] + " " + (name?.length > 1) ? name[1] : "",
                        conversationId: item?.conversationId,
                        avatar: item?.profilePicture,
                      },
                    })
                  }}
                  className="px-1 py-[1px] text-xs"
                >
                  Chat Room
                </Button>
                {(session?.user?.email === "ADMIN" || session?.user?.email === "SUPER_ADMIN") &&
                  !item?.isPaid && (
                    <Button
                      variant="pill"
                      onClick={() => {
                        //  make batch payout here
                        handlePayout(item.amount, item.email, item.id)

                        //  commission id -> item?.id
                      }}
                      className="mt-1 px-1 py-[1px] text-xs"
                    >
                      Mark Paid
                    </Button>
                  )}
                <span className="text-lg">${item?.amount}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CommissionResponsive
