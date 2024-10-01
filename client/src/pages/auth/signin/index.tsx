import React, { useEffect } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { useUserContext } from "@/providers/user-context"

import SigninLayout from "@/components/auth/signin/layout"

const SigninPage: NextPage = () => {
  const router = useRouter()
  const form = useForm()

  const { handleSignin } = useUserContext()

  useEffect(() => {
    if (router.query.error) {
      const error = router.query.error
      router.replace({ pathname: router.pathname, query: {} }, undefined, { shallow: true })
      toast.error(error as string)
    }
  }, [router, router.isReady])

  const handleSubmit = async (data: FieldValues) => {
    const res = await handleSignin({
      email: data.email,
      password: data.password,
    })
    if (res.success == "success") {
      toast.success("Login Successfull")
      router.push("/")
    }
  }

  return <SigninLayout form={form} onSubmit={handleSubmit} />
}

export default SigninPage
