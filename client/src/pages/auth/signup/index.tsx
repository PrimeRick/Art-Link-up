import React from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { FieldValues, useForm } from "react-hook-form"

import { useUserContext } from "@/providers/user-context"

import SignupLayout from "@/components/auth/signup/layout"

const SignupPage: NextPage = () => {
  const form = useForm()
  const router = useRouter()
  const { handleSignup } = useUserContext()

  const handleSubmit = async (data: FieldValues) => {
    // const userName=
    handleSignup({
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      password: data.password,
      // phone: data.phone,
      isArtist: false,
    }).then((data) => {
      if (data.success === "success") {
        router.push("/")
      }
    })
  }

  return <SignupLayout form={form} onSubmit={handleSubmit} isArtist={false} />
}

export default SignupPage
