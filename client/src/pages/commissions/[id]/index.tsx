import React from "react"
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next"

import { getSession } from "@/lib/auth"
import { fetchData } from "@/utils"

import MainLayout from "@/components/layout/layouts/main"
import CustomerCard from "@/components/ui/commision-card"

const OrderCommissionPage = ({
  unfinishedCommissions,
  finishedCommissions,
}: {
  unfinishedCommissions: CommissionData[]
  finishedCommissions: CommissionData[]
}) => {
  return (
    <MainLayout>
      <h2>Ongoing Commission</h2>
      {unfinishedCommissions.length > 0 ? (
        <CustomerCard Commisions={unfinishedCommissions} viewMode="single" />
      ) : (
        <div className="center min-h-[200px] text-[24px]  ">No Ongoing Commissions...</div>
      )}
      <h2>Finished Commission</h2>

      {finishedCommissions.length > 0 ? (
        <CustomerCard Commisions={finishedCommissions} viewMode="single" />
      ) : (
        <div className="center min-h-[200px] text-[24px] "> No Finished Commissions...</div>
      )}
    </MainLayout>
  )
}

export default OrderCommissionPage
export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const session = await getSession(req as NextApiRequest, res as NextApiResponse)
  let Artists
  if (!session) {
    return {
      notFound: true,
    }
  }
  if (session)
    if (session.user?.email == "ARTIST") {
      Artists = await fetchData(`/v1/commission/artist`, session?.user?.name as string, "GET")
    } else {
      Artists = await fetchData(
        `/v1/commission/user/${query.id}`,
        session?.user?.name as string,
        "GET"
      )
    }
  if (Artists?.error) {
    return {
      notFound: true,
    }
  }
  Artists = Artists?.data.commissions
  // console.log("commistion ,", Artists)

  const users = Artists.map((commission: Allow) => {
    // console.log("conversation", commission.client.conversations[0].conversation.id)
    return {
      name: commission.package.artist.username,
      artistId: commission.package.artist.id,
      email: commission.package.artist.email,
      amount: commission.package.price,
      profilePicture: commission.package.artist.profileImage,
      clientProfilePicture: commission.client.profileImage,
      clientName: commission.client.username,
      startedOn: commission.createdAt,
      deadline: new Date(commission.createdAt).setDate(
        new Date(commission.createdAt).getDate() + commission.package.totalDays
      ),
      timeLeft: `${commission.package.totalDays} days`,
      isFinished: commission.isFinished,
      isReported: commission.isReported,
      conversationId: commission.client.conversations[0].conversation.id,
    }
  })
  const finishedCommissions = users.filter((commission: Allow) => commission.isFinished === true)
  const unfinishedCommissions = users.filter((commission: Allow) => commission.isFinished !== true)
  // console.log(users)
  return {
    props: {
      finishedCommissions,
      unfinishedCommissions,
    },
  }
}
