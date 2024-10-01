import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

import { useUserContext } from "@/providers/user-context"
import { fetchData } from "@/utils"

import Button from "../button"

import CommissionResponsive from "./CommissionResponsive"

const AllComm = ({ Commissions }: { Commissions: Allow }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const { user } = useUserContext()
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
    if (res?.error) {
      toast.error(res?.message)
    } else {
      router.push("/admin")
      toast.success(res?.message)
    }
  }

  return (
    <div className="center w-[100%] px-2 md:px-0">
      <div className="mt-8">
        <table className="hidden w-full text-sm md:block">
          <thead className="border-y font-medium text-gray-600">
            <tr>
              <td className="whitespace-nowrap py-2 text-center md:px-2 lg:px-4"></td>
              <td className="whitespace-nowrap py-2 text-center md:px-2 lg:px-4">Artist Name</td>
              <td className="whitespace-nowrap py-2 text-center md:px-2 lg:px-4">Customer Name</td>
              <td className="whitespace-nowrap py-2 text-center md:px-2 lg:px-4">Price</td>
              <td className="whitespace-nowrap py-2 text-center md:px-2 lg:px-4">Start Date</td>
              <td className="whitespace-nowrap py-2 text-center md:px-2 lg:px-4">End Date</td>
              <td className="whitespace-nowrap py-2 text-center md:px-2 lg:px-4"></td>
            </tr>
          </thead>
          <tbody className="font-bold text-[#000]">
            {Commissions.length > 0 ? (
              Commissions.map((item: Allow, idx: Allow) => (
                <tr className="border-y hover:shadow-sm" key={idx}>
                  <td className="whitespace-nowrap py-2 text-center md:px-2 lg:px-4">
                    <div className="flex -space-x-3 rtl:space-x-reverse">
                      <Image
                        key={"img1"}
                        alt=""
                        src={item.profilePicture}
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
                  <td className="whitespace-nowrap py-2 text-center md:px-1 lg:px-4">
                    {item?.name}
                  </td>
                  <td className="whitespace-nowrap py-2 text-center md:px-1 lg:px-4">
                    {item?.clientName}
                  </td>
                  <td className="whitespace-nowrap py-2 text-center md:px-1 lg:px-4">
                    ${item.amount}
                  </td>
                  <td className="whitespace-nowrap py-2 text-center md:px-1 lg:px-4">
                    {new Date(item.startedOn).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap py-2 text-center md:px-1 lg:px-4">
                    {new Date(item?.endDate).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap py-2 text-center md:px-1 lg:px-4">
                    <Button
                      variant="pill"
                      onClick={() => {
                        const id = user?.id === item?.artistId ? user?.id : item?.artistId
                        const name = item.name.split(".")
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
                      className="mr-2 px-2 py-[2px] text-xs"
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
                          className="px-2 py-[2px] text-xs"
                        >
                          Mark Paid
                        </Button>
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <div className="center"> No commissions Yet</div>
            )}
          </tbody>
        </table>
        <CommissionResponsive commissions={Commissions} viewMode="single" />
      </div>
    </div>
  )
}

export default AllComm
