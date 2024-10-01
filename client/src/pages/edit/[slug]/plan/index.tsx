import React, { useState } from "react"
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next"
import { FieldValues, useForm } from "react-hook-form"

import { getSession } from "@/lib/auth"
import { useUserContext } from "@/providers/user-context"
import { fetchData } from "@/utils"

import EditLayout from "@/components/auth/edit/plan/layout"

const EditPlanPage = ({ Package }: { Package: Package[] }) => {
  const form = useForm()
  const { handleEditPlan } = useUserContext()
  const [isUpdate, setisUpdate] = useState<boolean>(true)

  const handleSubmit = async (data: FieldValues) => {
    const dataArray = []

    for (let i = 1; i <= 3; i++) {
      const name = i === 1 ? "BASIC_PLAN" : i == 2 ? "STANDARD" : "PREMIUM"
      let id
      if (isUpdate) {
        id = Package[i - 1]?.id
      }
      const packageData = {
        isUpdate: isUpdate,
        packageId: id,
        totalRevisions: Number(data[`totalRevisions${i}`]),
        totalDays: Number(data[`totalDays${i}`]),
        price: Number(data[`price${i}`]),
        actualName: data[`actualName${i}`],
        name: name,
        description: data[`description${i}`],
        isArtist: true,
      }

      dataArray.push(packageData)
    }

    console.clear()
    console.log(dataArray)
    handleEditPlan(dataArray).then(() => {})
  }

  return (
    <EditLayout
      form={form}
      onSubmit={handleSubmit}
      isArtist={false}
      Package={Package}
      setisUpdate={setisUpdate}
    />
  )
}

export default EditPlanPage
export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const session = await getSession(req as NextApiRequest, res as NextApiResponse)
  let Artist
  const { slug } = query
  if (session) Artist = await fetchData(`/v1/users/${slug}`, session?.user?.name as string, "GET")
  if (Artist?.error || !Artist?.data.user.id) {
    return {
      notFound: true,
    }
  }
  Artist = Artist?.data.user
  // console.log("these artists ", Artist)

  const user = Artist

  return {
    props: {
      Package: user.Package,
    },
  }
}
