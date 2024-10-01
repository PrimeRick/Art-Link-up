import React from "react"
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next"

import { getSession } from "@/lib/auth"
import { fetchData } from "@/utils"

import CommissionOrder from "@/components/commissions/commission-order"
import MainLayout from "@/components/layout/layouts/main"

const OrderCommissionPage = ({ packages }: { packages: Package[] }) => {
  return (
    <MainLayout>
      <h2>Order Commission</h2>
      <CommissionOrder packages={packages} />
    </MainLayout>
  )
}

export default OrderCommissionPage
export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const session = await getSession(req as NextApiRequest, res as NextApiResponse)
  if (!session?.user?.name) {
    return {
      notFound: true,
    }
  }
  const { slug } = query

  let Artists
  if (!slug) {
    return {
      notFound: true,
    }
  }
  if (session)
    Artists = await fetchData(`/v1/package/user/${slug}`, session?.user?.name as string, "GET")
  // console.log("thse re commision of user ")
  if (Artists?.error) {
    return {
      notFound: true,
    }
  }
  Artists = Artists?.data.packages

  const users: Package[] | null = Artists

  return {
    props: {
      packages: users,
    },
  }
}
