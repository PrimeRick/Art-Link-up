import React from "react"
import { GetServerSideProps, NextApiRequest, NextApiResponse, NextPage } from "next"
import { useRouter } from "next/router"
import { FieldValues, useForm } from "react-hook-form"

import { getSession } from "@/lib/auth"
import { useUserContext } from "@/providers/user-context"

import AdminLayout from "@/components/auth/admin/layout"

const AdminPage: NextPage = () => {
  const form = useForm()
  const router = useRouter()
  const { handleAdminCreate } = useUserContext()

  const handleSubmit = async (data: FieldValues) => {
    // const userName=
    handleAdminCreate({
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      password: data.password,
    }).then((data) => {
      if (data.success === "success") {
        router.push("/")
      }
    })
  }

  return <AdminLayout form={form} onSubmit={handleSubmit} />
}

export default AdminPage
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req as NextApiRequest, res as NextApiResponse)
  if (!session || session.user?.email != "SUPER_ADMIN") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    }
  }
  return {
    props: {},
  }
}
