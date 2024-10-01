import React from "react"
import { GetServerSideProps, NextApiRequest, NextApiResponse, NextPage } from "next"
import { useRouter } from "next/router"
import { FieldValues, useForm } from "react-hook-form"

import { getSession } from "@/lib/auth"
import { useUserContext } from "@/providers/user-context"

import SignupLayout from "@/components/auth/signup/layout"

const SignupPage: NextPage = () => {
  const form = useForm()
  const router = useRouter()
  const { handleSignup } = useUserContext()

  const handleSubmit = async (data: FieldValues) => {
    // const userName=
    // console.log("sginup request data ", data)
    handleSignup({
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      password: data.password,
      // phone: data.phone,
      isArtist: true,
    }).then(() => {
      router.push("/")
    })
  }

  return <SignupLayout form={form} onSubmit={handleSubmit} isArtist={true} />
}

export default SignupPage
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req as NextApiRequest, res as NextApiResponse)
  if (!session || !(session.user?.email == "ADMIN" || session.user?.email == "SUPER_ADMIN")) {
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
