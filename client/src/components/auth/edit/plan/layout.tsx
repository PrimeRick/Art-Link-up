import React, { useEffect, useState } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

import generateRegex from "@/utils/generate-input-validation-regex"

import AuthLayout from "@/components/layout/layouts/auth"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import PricingPlans from "@/components/ui/pricing-plan"

interface EditLayoutProps {
  form: UseFormReturn<FieldValues, unknown, undefined>
  onSubmit: (data: FieldValues) => Promise<void>
  isArtist: boolean
  Package: Package[]
  setisUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const EditLayout: React.FC<EditLayoutProps> = ({ form, onSubmit, Package, setisUpdate }) => {
  interface FormData {
    [key: string]: string | number | undefined // Add an index signature
  }
  const [formData1, setFormData1] = useState<FormData>({
    id: "",
    totalRevisions1: undefined,
    actualName1: "BASIC",
    totalDays1: undefined,
    price1: undefined,
    name1: "BASIC_PLAN",
    description1: "",
  })
  const [formData2, setFormData2] = useState<FormData>({
    id: "",
    totalRevisions2: undefined,
    totalDays2: undefined,
    actualName2: "STANDARD",
    price2: undefined,
    name2: "STANDARD",
    description2: "",
  })
  const [formData3, setFormData3] = useState<FormData>({
    id: "",
    totalRevisions3: undefined,
    totalDays3: undefined,
    actualName3: "PREMIUM",
    price3: undefined,
    name3: "PREMIUM",
    description3: "",
  })
  const [isUpdated, setIsUpdated] = useState(false)
  const ps = [formData1, formData2, formData3].map((formData, i) => {
    return {
      name: formData[`actualName${i + 1}`] as string,
      price: formData[`price${i + 1}`] as number,
      actualName: formData[`actualName${i + 1}`] as string,
      currency: "$",
      description: formData[`description${i + 1}`] as string,
      deliveryTime: formData[`totalDays${i + 1}`] + " days",
      revisions: formData[`totalRevisions${i + 1}`] + " revisions",
    }
  })

  const [, setforceRerender] = useState<boolean>(false)
  const [curr, setcurr] = useState(0)
  const {
    register,
    clearErrors,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, touchedFields },
  } = form

  console.log(watch())

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
        min={type === "number" ? 1 : undefined}
        onChangeHandler={(e) => {
          curr == 0
            ? setFormData1((prev) => ({
                ...prev,
                [registrationName]:
                  type === "number" ? Number(e.target.value).toString() : e.target.value,
              }))
            : curr == 1
            ? setFormData2((prev) => ({
                ...prev,
                [registrationName]:
                  type === "number" ? Number(e.target.value).toString() : e.target.value,
              }))
            : setFormData3((prev) => ({
                ...prev,
                [registrationName]:
                  type === "number" ? Number(e.target.value).toString() : e.target.value,
              }))
        }}
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
          min:
            typeof type === "number"
              ? {
                  message: "Minimum value is 1",
                  value: 1,
                }
              : undefined,
        })}
      />
    )
  }

  useEffect(() => {
    if (Package.length > 0 && !isUpdated) {
      setIsUpdated(true)
      const setInitialData = (packageData: Package) => {
        const { name, totalRevisions, totalDays, price, description, id, actualname } = packageData
        console.log({ packageData })
        switch (name) {
          case "BASIC_PLAN":
            setFormData1({
              id,
              totalRevisions1: totalRevisions ?? 0,
              actualName1: actualname,
              totalDays1: totalDays ?? 0,
              price1: price ?? 0,
              name1: "BASIC_PLAN",
              description1: description,
            })
            break
          case "STANDARD":
            setFormData2({
              id,
              totalRevisions2: totalRevisions ?? 0,
              actualName2: actualname,
              totalDays2: totalDays ?? 0,
              price2: price ?? 0,
              name2: "STANDARD",
              description2: description,
            })
            break
          case "PREMIUM":
            setFormData3({
              id,
              totalRevisions3: totalRevisions ?? 0,
              actualName3: actualname,
              totalDays3: totalDays ?? 0,
              price3: price ?? 0,
              name3: "PREMIUM",
              description3: description,
            })
            break
          default:
            break
        }
      }

      Package.forEach(setInitialData)
    }

    if (Package.length == 0) {
      setisUpdate(false)
    }
  }, [Package])

  useEffect(() => {
    console.log("printinig", formData1, formData2, formData3)
    // Fill formdata using setValue
    const setValueFromFormData = (formData: FormData, i: number) => {
      console.log({
        formData,
        [`actualName${i + 1}`]: formData[`actualName${i + 1}`],
        [`totalRevisions${i + 1}`]: formData[`totalRevisions${i + 1}`],
        [`totalDays${i + 1}`]: formData[`totalDays${i + 1}`],
        [`price${i + 1}`]: formData[`price${i + 1}`],
        [`description${i + 1}`]: formData[`description${i + 1}`],
      })
      setValue(`actualName${i + 1}`, formData[`actualName${i + 1}`] ?? "")
      setValue(`totalRevisions${i + 1}`, formData[`totalRevisions${i + 1}`] ?? 0)
      setValue(`totalDays${i + 1}`, formData[`totalDays${i + 1}`] ?? 0)
      setValue(`price${i + 1}`, formData[`price${i + 1}`] ?? 0)
      setValue(`description${i + 1}`, formData[`description${i + 1}`] ?? "")
    }
    setforceRerender((prev) => !prev)

    setValueFromFormData(formData1, 0)
    setValueFromFormData(formData2, 1)
    setValueFromFormData(formData3, 2)
  }, [formData1, formData2, formData3, curr])

  return (
    <AuthLayout>
      <div className="center flex-col space-y-4 px-8 md:px-0">
        <div className="flex max-w-lg items-start justify-start overflow-hidden">
          <PricingPlans
            className="w-full scale-90 md:min-w-[520px]"
            onChange={(num) => {
              setcurr(num)
            }}
            plans={ps.map((p: Allow) => {
              const currentInd = p.name === "BASIC" ? 1 : p.name === "STANDARD" ? 2 : 3
              const ds = getValues(`description${currentInd}`)

              return {
                ...p,
                description: ds ? ds : "",
              }
            })}
            cta={{
              text: "Order Commission",
              onClick: () => {},
            }}
            isButtonVisible={false}
          />
        </div>
        <>
          {curr === 0 && (
            <>
              {renderInputs("actualName", "actualName1")}
              {renderInputs("totalRevisions", "totalRevisions1", "number")}
              {renderInputs("totalDays", "totalDays1", "number")}
              {renderInputs("price", "price1", "number")}
              {/* {renderInputs("description", "description1")} */}
              <textarea
                cols={5}
                onChange={(e) => {
                  setValue("description1", e.target.value)
                  setFormData1((prev) => ({ ...prev, ["description1"]: e.target.value }))
                }}
                value={formData1["description1"]}
                placeholder="Description"
                className="peer block w-full appearance-none rounded-lg border border-solid border-secondary-white bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0"
              />
            </>
          )}

          {curr === 1 && (
            <>
              {renderInputs("actualName", "actualName2")}
              {renderInputs("totalRevisions", "totalRevisions2", "number")}
              {renderInputs("totalDays", "totalDays2", "number")}
              {renderInputs("price", "price2", "number")}
              {/* {renderInputs("description", "description2")} */}
              <textarea
                cols={5}
                onChange={(e) => {
                  setValue("description2", e.target.value)
                  setFormData2((prev) => ({ ...prev, ["description2"]: e.target.value }))
                }}
                value={formData2["description2"]}
                placeholder="Description"
                className="peer block w-full appearance-none rounded-lg border border-solid border-secondary-white bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0"
              />
            </>
          )}

          {curr === 2 && (
            <>
              {renderInputs("actualName", "actualName3")}
              {renderInputs("totalRevisions", "totalRevisions3", "number")}
              {renderInputs("totalDays", "totalDays3", "number")}
              {renderInputs("price", "price3", "number")}
              {/* {renderInputs("description", "description3")} */}
              <textarea
                cols={5}
                onChange={(e) => {
                  setValue("description3", e.target.value)
                  setFormData3((prev) => ({ ...prev, ["description3"]: e.target.value }))
                }}
                value={formData3["description3"]}
                placeholder="Description"
                className="peer block w-full appearance-none rounded-lg border border-solid border-secondary-white bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0"
              />
            </>
          )}
        </>

        <Button
          onClick={() => {
            handleSubmit(onSubmit)()
          }}
          className="mb-8 w-full grow px-20 py-3"
        >
          Save Changes
        </Button>
      </div>
    </AuthLayout>
  )
}

export default EditLayout
