import React from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

import { useUserContext } from "@/providers/user-context"
import { fetchData } from "@/utils"

import CommissionResponsive from "../commission-list/CommissionResponsive"
// interface Customer {
//   name: string
//   email: string
//   amount: number
//   profilePicture: string
//   startedOn: string
//   deadline: string
//   timeLeft: string
// }

interface CustomerCardProps {
  reportedCommissions?: Allow[]
  Commisions?: Allow[]
  viewMode: "single" | "double"
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  Commisions,
  reportedCommissions,
  viewMode,
}) => {
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
    // console.log(res?.data)
    if (res?.error) {
      toast.error(res?.message)
    } else {
      router.push("/admin")
      toast.success(res?.message)
    }
  }
  let Comm = []
  if (Commisions) {
    Comm = Commisions
  } else {
    Comm = reportedCommissions ?? []
  }
  return (
    <>
      <div className="w-full md:px-6">
        <div className="hidden w-full rounded-lg border border-gray-200 bg-white px-2 py-2 shadow dark:border-gray-700 dark:bg-gray-800 sm:p-8 md:block ">
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200 pl-0 dark:divide-gray-700">
              {Comm?.length > 0 ? (
                Comm?.map((customer, index) => {
                  const name = customer.name.split(".")

                  return (
                    <li key={index} className="py-3 sm:py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {viewMode == "single" ? (
                            <Image
                              className="h-8 w-8 rounded-full sm:h-20 sm:w-20"
                              src={customer.profilePicture}
                              alt={``}
                              height={200}
                              width={200}
                            />
                          ) : (
                            <div className="flex -space-x-4 rtl:space-x-reverse">
                              <Image
                                className="h-10 w-10 rounded-full border-2 border-gray-900 "
                                src={customer.profilePicture}
                                alt=""
                                height={200}
                                width={200}
                              />
                              <Image
                                className="h-10 w-10 rounded-full border-2 border-gray-900 "
                                src={customer.clientprofilePicture}
                                alt=""
                                height={200}
                                width={200}
                              />
                            </div>
                          )}
                        </div>
                        <div className="ms-4 flex min-w-0 flex-1 flex-col gap-1">
                          {/* 1st */}
                          {viewMode == "single" && (
                            <>
                              <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                {name[0] + " "}
                                {name[1]}
                              </div>
                              <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                                {customer.email}
                              </div>
                            </>
                          )}
                          <div className="flex w-1/2 min-w-0 flex-1 flex-wrap gap-x-5 gap-y-1">
                            <div className="flex flex-col gap-1">
                              {/* 2nd */}
                              {viewMode == "double" && (
                                <>
                                  <div className="flex gap-2 truncate font-medium text-gray-900 dark:text-white">
                                    <div className="mb-[4px] mt-auto w-[70px] text-[11px] font-semibold">
                                      Artist Name :
                                    </div>

                                    <div className="mt-auto text-center text-[16px]">
                                      {name[0] + " "}
                                      {name[1]}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 truncate font-medium text-gray-900 dark:text-white">
                                    <div className="mb-[4px] mt-auto w-[90px] text-[11px] font-semibold">
                                      Customer Name :
                                    </div>

                                    <div className="mt-auto text-center text-[16px]">
                                      {customer?.clientName}
                                    </div>
                                  </div>
                                </>
                              )}

                              <div className="flex gap-2 truncate font-medium text-gray-900 dark:text-white">
                                <div className="mb-[4px] mt-auto w-[60px] text-[11px] font-semibold">
                                  Started On :
                                </div>

                                <div className="mt-auto text-center text-[16px]">
                                  {new Date(customer.startedOn).toLocaleDateString()}
                                </div>
                              </div>
                              {/* 1st */}
                              {viewMode == "single" && (
                                <>
                                  <div className="flex gap-2 truncate font-medium text-gray-900 dark:text-white">
                                    <div className="mb-[4px] mt-auto w-[60px] text-[11px] font-semibold">
                                      Deadline :
                                    </div>

                                    <div className="mt-auto text-center text-[16px]">
                                      {new Date(customer?.deadline).toLocaleDateString()}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="flex gap-2 truncate font-medium text-gray-900 dark:text-white">
                              {viewMode == "single" && (
                                <>
                                  <div className="mb-[3px] mt-auto text-[11px] font-semibold">
                                    Time Left :
                                  </div>
                                  <div className="mt-auto text-center text-[20px]">
                                    {customer?.timeLeft}
                                  </div>
                                </>
                              )}

                              {/* 2nd */}
                              {viewMode == "double" && (
                                <>
                                  <div className="mb-[4px] mt-auto w-[60px] text-[11px] font-semibold">
                                    Deadline :
                                  </div>
                                  <div className="mt-auto text-center text-[16px]">
                                    {new Date(customer?.deadline).toLocaleDateString()}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          {/* 2nd */}
                          {viewMode == "double" && (
                            <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                              {customer?.email}
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-[122px] flex-col items-center justify-center gap-6 p-2 text-gray-900 dark:text-white">
                          <div
                            className="w-full cursor-pointer rounded-xl bg-[#1E1E1E] px-2 py-1 text-center font-montserrat text-[11px] font-extrabold text-[#fff]"
                            onClick={() => {
                              const id =
                                user?.id === customer?.artistId ? user?.id : customer?.artistId
                              const name = customer.name.split(".")
                              router.push({
                                pathname: "/chat/dev",
                                query: {
                                  id: id as string,
                                  title: name[0] + " " + (name?.length > 1) ? name[1] : "",
                                  conversationId: customer?.conversationId,
                                  avatar: customer?.profilePicture,
                                },
                              })
                            }}
                          >
                            Chat Room
                          </div>
                          {(session?.user?.email === "ADMIN" ||
                            session?.user?.email === "SUPER_ADMIN") &&
                            !customer?.isPaid && (
                              <div
                                className="w-full cursor-pointer rounded-xl bg-[#1E1E1E] px-2 py-1 text-center font-montserrat text-[11px] font-extrabold text-[#fff]"
                                onClick={() => {
                                  //  make batch payout here
                                  handlePayout(customer?.amount, customer?.email, customer?.id)

                                  //  commission id -> customer?.id
                                }}
                              >
                                Mark Paid
                              </div>
                            )}
                          <div className="flex w-full items-center justify-between ">
                            <span className="mb-[3px] mt-auto text-xs font-normal ">Price:</span>
                            <span className="font-montserrat text-lg font-semibold">
                              ${customer?.amount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })
              ) : (
                <div className="center"> No commissions Yet</div>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="center w-[100%] px-2 md:px-0">
        <CommissionResponsive commissions={reportedCommissions} viewMode="double" />
      </div>
    </>
  )
}

export default CustomerCard
