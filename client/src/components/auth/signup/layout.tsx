import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { toast } from "react-toastify"

import GoogleIcon from "@/assets/image/google.svg"
import generateRegex from "@/utils/generate-input-validation-regex"

import AuthLayout from "@/components/layout/layouts/auth"
import Button from "@/components/ui/button"
import CustomCheckbox from "@/components/ui/checkbox"
import Divider from "@/components/ui/divider"
import Input from "@/components/ui/input"

interface SignupLayoutProps {
  form: UseFormReturn<FieldValues, unknown, undefined>
  onSubmit: (data: FieldValues) => Promise<void>
  isArtist: boolean
}

const SignupLayout: React.FC<SignupLayoutProps> = ({ form, onSubmit, isArtist }) => {
  const [isTermsAndConditionsAccepted, setIsTermsAndConditionsAccepted] = useState(false)

  const {
    register,
    clearErrors,
    handleSubmit,
    formState: { errors, touchedFields },
  } = form

  const renderInputs = (
    placeholder: string,
    registrationName: string,
    type: React.HTMLInputTypeAttribute = "text"
  ) => {
    const regex = generateRegex(type)

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
      <div className="center flex-col space-y-4 px-8 md:px-0">
        {isArtist ? <h1>Create an Artist</h1> : <h1>Create an Account</h1>}

        <div className="flex flex-col gap-2 md:min-w-[700px] md:flex-row md:gap-5">
          {!isArtist && (
            <Button
              className="mx-auto  flex items-center gap-2 px-12 py-3 md:px-20"
              onClick={() => {
                signIn("google", { callbackUrl: "/" })
              }}
            >
              {" "}
              <Image src={GoogleIcon} alt="" height={200} width={200} className="h-5 w-5" />
              Sign up with Google{" "}
            </Button>
          )}
        </div>
        {!isArtist && (
          <Divider content="or" parentClassName="my-8" className="text-secondary-white" />
        )}
        <div className="grid w-full grid-cols-1 gap-5">
          {!isArtist
            ? renderInputs(` User Name`, "firstname")
            : renderInputs(`Artist's User Name`, "firstname")}
          {/* {!isArtist
            ? renderInputs(` Last Name`, "lastname")
            : renderInputs(`Artist's Last Name`, "lastname")} */}
        </div>
        {!isArtist
          ? renderInputs(" Email", "email", "email")
          : renderInputs("Artist's Email", "email", "email")}
        {!isArtist
          ? renderInputs("Password ", "password", "password")
          : renderInputs("Enter a Password for Artist", "password", "password")}
        {/* {!isArtist
          ? renderInputs(" Phone Number", "phone", "tel")
          : renderInputs("Artist's Phone Number", "phone", "tel")} */}

        {!isArtist && (
          <div className="mb-8 w-full gap-2 text-sm text-gray-500/75 sm:items-center sm:text-base md:flex md:flex-row">
            <CustomCheckbox
              id={"Agree terms"}
              checked={isTermsAndConditionsAccepted}
              onChange={(check) => {
                setIsTermsAndConditionsAccepted(check)
              }}
              variant="square"
            />
            I agree to the{" "}
            <Link
              className="whitespace-nowrap transition-all hover:text-gray-600/80 md:-mx-1"
              href={"#"}
            >
              Terms of Service{" "}
            </Link>
            &
            <Link
              className="whitespace-nowrap transition-all hover:text-gray-600/80 md:-mx-1"
              href={"#"}
            >
              {" "}
              Privacy Statement
            </Link>
          </div>
        )}
        <Button
          onClick={() => {
            if (!isArtist && !isTermsAndConditionsAccepted) {
              toast.dismiss()
              toast("Please accept the terms and conditions")
              return
            }
            handleSubmit(onSubmit)()
          }}
          className="mb-8 w-full grow px-20 py-3"
        >
          {isArtist ? <>Create</> : <>Sign Up</>}
        </Button>
        {!isArtist && (
          <p className="mt-2 text-sm">
            Already have an account?
            <Link href="/auth/signin" className="px-2 font-bold">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  )
}

export default SignupLayout
