import React from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

import generateRegex from "@/utils/generate-input-validation-regex"

import AuthLayout from "@/components/layout/layouts/auth"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"

interface AdminLayoutProps {
  form: UseFormReturn<FieldValues, unknown, undefined>
  onSubmit: (data: FieldValues) => Promise<void>
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ form, onSubmit }) => {
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
        {<h1>Create an Admin</h1>}

        <div className="grid w-full grid-cols-1 gap-5">
          {renderInputs(`Admin's User Name`, "firstname")}
          {/* {!isArtist
            ? renderInputs(` Last Name`, "lastname")
            : renderInputs(`Artist's Last Name`, "lastname")} */}
        </div>
        {renderInputs("Admin's Email", "email", "email")}
        {renderInputs("Enter a Password for Admin", "password", "password")}

        <Button
          onClick={() => {
            handleSubmit(onSubmit)()
          }}
          className="mb-8 w-full grow px-20 py-3"
        >
          {<>Create</>}
        </Button>
      </div>
    </AuthLayout>
  )
}

export default AdminLayout
