import React, { useState } from "react"
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next"

import { getSession } from "@/lib/auth"
import { fetchData } from "@/utils"

import MainLayout from "@/components/layout/layouts/main"
import Button from "@/components/ui/button"
import AllComm from "@/components/ui/commission-list/AllComm"
import ReportedComm from "@/components/ui/commission-list/ReportedComm"

const ListCommissionPage = ({
  reportedCommissions,
  Commissions,
  unPaidCommissions,
}: {
  reportedCommissions: CommissionData[]
  Commissions: CommissionData[]
  unPaidCommissions: CommissionData[]
}) => {
  const [commissionType, setCommissionType] = useState("All")
  return (
    <MainLayout>
      <div className="center flex-col space-y-4 px-1 sm:px-4 md:px-0">
        <div className="center flex w-[80%] space-x-4 px-4 md:px-0">
          <Button
            onClick={() => {
              setCommissionType("All")
            }}
            className={`mb-8 w-full grow px-1 py-3 md:px-8 ${
              commissionType != "All" &&
              "border border-black bg-white text-slate-900  hover:bg-slate-100"
            }`}
          >
            All Commission
          </Button>
          <Button
            onClick={() => {
              setCommissionType("Reported")
            }}
            className={`mb-8 w-full grow px-1 py-3 md:px-8 ${
              commissionType != "Reported" &&
              "border border-black bg-white text-slate-900 hover:bg-slate-100"
            }`}
          >
            Reported Commission
          </Button>
          <Button
            onClick={() => {
              setCommissionType("Unpaid")
            }}
            className={`mb-8 w-full grow px-1 py-3 md:px-8 ${
              commissionType != "Unpaid" &&
              "border border-black bg-white text-slate-900 hover:bg-slate-100"
            }`}
          >
            Unpaid Commission
          </Button>
        </div>
        {commissionType == "All" ? (
          <AllComm Commissions={Commissions} />
        ) : commissionType == "Reported" ? (
          <ReportedComm reportedCommissions={reportedCommissions} />
        ) : (
          <ReportedComm reportedCommissions={unPaidCommissions} />
        )}
      </div>
    </MainLayout>
  )
}

export default ListCommissionPage
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req as NextApiRequest, res as NextApiResponse)
  let Response
  if (session) Response = await fetchData(`/v1/commission/`, session?.user?.name as string, "GET")
  if (Response?.error) {
    return {
      notFound: true,
    }
  }
  Response = Response?.data.commissions

  const users = (Response ?? []).map((commission: Allow) => {
    return {
      id: commission?.id,
      name: commission?.package?.artist?.username,
      artistId: commission?.package?.artist?.id,
      email: commission?.package?.artist?.email,
      amount: commission?.package?.price,
      profilePicture: commission?.package?.artist?.profileImage,
      clientProfilePicture: commission?.client?.profileImage,
      clientName: commission?.client?.username,
      startedOn: commission?.createdAt,
      deadline: new Date(commission?.createdAt).setDate(
        new Date(commission?.createdAt).getDate() + commission?.package.totalDays
      ),
      endDate: new Date(commission?.createdAt).setDate(
        new Date(commission?.createdAt).getDate() + commission?.package.totalDays
      ),
      timeLeft: `${commission?.package.totalDays} days`,
      isFinished: commission?.isFinished,
      isReported: commission?.isReported,
      isPaid: commission?.isPaid,
      conversationId: commission?.client?.conversations.length
        ? commission?.client?.conversations[0]?.conversation?.id
        : "",
    }
  })
  const reportedCommissions = (users ?? []).filter(
    (commission: Allow) => commission?.isReported === true
  )
  const unPaidCommissions = (users ?? []).filter((commission: Allow) => commission.isPaid != true)

  if (!users) {
    return {
      notFound: true,
    }
  }
  // console.log(users)
  return {
    props: {
      reportedCommissions,
      Commissions: users,
      unPaidCommissions,
    },
  }
}
