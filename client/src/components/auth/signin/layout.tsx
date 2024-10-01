import React from "react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { FieldValues, UseFormReturn } from "react-hook-form"

import GoogleIcon from "@/assets/image/google.svg"
import generateRegex from "@/utils/generate-input-validation-regex"

import AuthLayout from "@/components/layout/layouts/auth"
import Button from "@/components/ui/button"
import Divider from "@/components/ui/divider"
import Input from "@/components/ui/input"

interface SignupLayoutProps {
  form: UseFormReturn<FieldValues, unknown, undefined>
  onSubmit: (data: FieldValues) => Promise<void>
}

const SignupLayout: React.FC<SignupLayoutProps> = ({ form, onSubmit }) => {
  const {
    register,
    watch,
    clearErrors,
    handleSubmit,
    formState: { errors, touchedFields },
  } = form

  console.log(watch())
  // console.log(errors)

  const renderInputs = (
    placeholder: string,
    registrationName: string,
    type: React.HTMLInputTypeAttribute = "text"
  ) => {
    const regex = generateRegex(type === "password" ? "text" : type)

    return (
      <Input
        mode="floating"
        type={type}
        className="w-full flex-1 grow overflow-hidden"
        variant="primary"
        placeholder={placeholder}
        errorHandling={{
          error:
            errors?.[registrationName]?.type === "required"
              ? placeholder + " is required"
              : errors?.[registrationName]?.message?.toString() ?? null,
          touched: touchedFields.name,
          clear: () => clearErrors(registrationName),
        }}
        {...register(registrationName, {
          required: true,
          pattern: {
            value: regex.regex,
            message: regex.errorMessage ?? "Invalid " + placeholder,
          },
          minLength: {
            value: regex.minLength,
            message: "Minimum length is " + regex.minLength,
          },
          maxLength: {
            value: regex.maxLength,
            message: "Maximum length is " + regex.maxLength,
          },
        })}
      />
    )
  }

  return (
    <AuthLayout>
      <div className="center flex-col space-y-4">
        <h1>Login</h1>
        <div className="flex flex-col gap-2 md:min-w-[700px] md:flex-row md:gap-5">
          <Button
            className="mx-auto mt-2 flex items-center gap-2 px-12 py-3 md:px-20 "
            onClick={() => {
              signIn("google", { callbackUrl: "/" })
            }}
          >
            <Image src={GoogleIcon} alt="" height={200} width={200} className="h-5 w-5" />
            Sign up with Google{" "}
          </Button>
        </div>
        <Divider content="or" parentClassName="my-8" className="text-secondary-white" />
        {renderInputs("Email", "email", "email")}
        {renderInputs("Password", "password", "password")}
        <Button
          onClick={() => {
            handleSubmit(onSubmit)()
          }}
          className="mb-8 w-full grow px-20 py-3"
        >
          Sign In
        </Button>
        <p className="mt-2 text-sm">
          Don't have an account?
          <Link href="/auth/signup" className="px-2 font-bold">
            Sign up for ArtLinkUp
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default SignupLayout
