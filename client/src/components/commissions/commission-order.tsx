import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { ImageListType } from "react-images-uploading"
import ReactTextareaAutosize from "react-textarea-autosize"
import { toast } from "react-toastify"

import AddIcon from "@/assets/svg/icons/add.icon.svg"
import { fetchData, fetchFile } from "@/utils"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

import PaypalPayment from "../payment/button"
import Button from "../ui/button"
import CustomCheckbox from "../ui/checkbox"
import ImageUpload from "../ui/image-upload"
import PaymentPlans from "../ui/payment-plans"

const question = (title: string) => {
  return (
    <span className="text-base font-light leading-3 tracking-wide text-primary-gray">{title}</span>
  )
}

const AddContainer: React.FC = () => {
  return (
    <div className="center h-64 w-64 flex-col gap-6 rounded-md shadow-md">
      <Image src={AddIcon} width={60} height={60} alt="" />
      <span className="text-sm font-light leading-3 tracking-wide text-primary-gray">
        Click or Drop here
      </span>
    </div>
  )
}

const ImageContainer: React.FC<{
  src: string
  onImageUpdate: () => void
  onImageRemove: () => void
}> = ({ onImageRemove, onImageUpdate, src }) => {
  return (
    <div className="group relative h-64 w-64 cursor-pointer overflow-hidden rounded-md shadow-md">
      <img src={src} alt="" className="h-full w-full object-cover object-center" />

      <div className="center -bottom-100 absolute h-0 w-full bg-gradient-radial from-black/50 via-black/40 to-transparent transition-all group-hover:bottom-0 group-hover:h-full">
        <div className="center hidden gap-2 group-hover:flex">
          <Button onClick={() => onImageUpdate()} variant="action" className="px-4 py-1">
            Update
          </Button>
          <Button onClick={() => onImageRemove()} variant="action" className="px-4 py-1">
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

const CommissionOrder = ({ packages }: { packages: Allow[] }) => {
  const { data: session } = useSession()
  const [image, setImage] = useState<File[] | string[] | null>(null)
  const [selectedPlan, setselectedPlan] = useState<string | null>(null)
  const [projectDetail, setprojectDetail] = useState<string>("")
  const [background, setBackground] = useState<string>("")
  let plans = packages.map((package1) => {
    return {
      x: package1.name,
      id: package1.id,
      title: package1.actualname,
      price: package1.price,
      currency: "$",
      revision: package1.totalRevisions,
      // figure: 1,
      // printable: true,
      delivery: package1.totalDays,
    }
  })
  plans = ["BASIC_PLAN", "STANDARD", "PREMIUM"].map(
    (name) =>
      plans.find((p: Allow) => p.x === name) ?? {
        x: "",
        currency: "$",
        delivery: "",
        id: "",
        price: 0,
        revision: "",
        title: "",
      }
  )

  const handleSendImage = async (): Promise<string[]> => {
    const formdata = new FormData()
    // console.log("uploading image files ")
    image?.map((img) => {
      formdata.append("files", img as File)
    })
    const isuploaded = await fetchFile(
      "/v1/upload/multiple",
      session?.user?.name as string,
      "POST",
      formdata
    )
    // console.log("image uploaded ", isuploaded)
    if (isuploaded?.error) {
      toast.dismiss(isuploaded?.message)
      return []
    } else {
      const newArray: string[] = []
      isuploaded?.data?.image?.map((loc: Allow) => {
        newArray.push(loc.Location)
      })
      // console.log("string array to upload ", newArray)
      setImage([...newArray])
      return newArray
    }
  }
  const [isTermsAndConditionsAccepted1, setIsTermsAndConditionsAccepted1] = useState(false)
  const [isTermsAndConditionsAccepted2, setIsTermsAndConditionsAccepted2] = useState(false)
  const [areAllFieldsFilled, setAreAllFieldsFilled] = useState(false)
  const [amount, setAmount] = useState("")
  const router = useRouter()
  const CreateCommision = async () => {
    // console.log("creating commsiison")
    // if (!isTermsAndConditionsAccepted1 || !isTermsAndConditionsAccepted2) {
    //   toast.dismiss()
    //   toast.info("Please accept the terms and conditions")
    //   return
    // }

    const imgarray = await handleSendImage()
    const creatComm = {
      backgroundDetails: background,
      artworkDetails: projectDetail,
      refPictures: imgarray,
      packageId: selectedPlan,
    }
    const data = await fetchData(
      "/v1/commission/user",
      session?.user?.name as string,
      "POST",
      creatComm
    )
    if (data?.error) {
      toast.error("Error ordering commission")
    } else {
      // console.log(data)
      // console.log(data?.data)
      router.push(
        {
          pathname: "/commissions/order/callback/success",
          query: {
            chatUrl: data?.data.chatUrl as string,
          },
        },
        "/commissions/order/callback/success"
      )
      // router.push("/commissions/order/callback/success")
      toast.success("Commission ordered")
    }
    // redirect to payment page here
    // console.log("create Commision Log ", data)
  }
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    intent: "capture",
  }
  // let amount: any;
  useEffect(() => {
    const val = packages.find((pack) => pack.id === selectedPlan)
    // console.log("is val coming ", val?.price)
    if (val) {
      // amount = val.price
      setAmount(String(val.price))
    }
  }, [selectedPlan])
  // Function to check if all fields are filled
  const checkAllFieldsFilled = () => {
    return (
      selectedPlan !== null &&
      projectDetail.trim() !== "" &&
      image !== null &&
      background.trim() !== ""
    )
  }

  // Update the areAllFieldsFilled state whenever any relevant state changes
  useEffect(() => {
    setAreAllFieldsFilled(checkAllFieldsFilled())
  }, [selectedPlan, projectDetail, background])

  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <div className="space-y-12">
          <div className="space-y-4">
            {question("1. Explain about the project you want to be made")}
            <div className="">
              <ReactTextareaAutosize
                rows={3}
                minRows={3}
                placeholder="Write about the project here ..."
                maxRows={20}
                className="w-full resize-none rounded-lg p-4 shadow-md"
                onChange={(e) => {
                  setprojectDetail(e.target.value)
                }}
              />
            </div>
          </div>
          <div className="space-y-4">
            {question("2. Upload the photo for reference related to your project")}
            <div className="">
              <ImageUpload
                multiple
                maxNumber={4}
                AddContainer={AddContainer}
                ImageContainer={ImageContainer}
                className="flex w-full resize-none flex-col items-center justify-end gap-4 rounded-lg p-4 shadow-md md:flex-row-reverse md:gap-12"
                onChange={(value: ImageListType) => {
                  // Upload the image here
                  if (
                    value.every((val) => {
                      // console.log("fiels ", val.file)
                      if (val?.file) return true
                      else return false
                    })
                  ) {
                    const files: File[] = value.map((val) => {
                      return val?.file as File
                    })
                    // console.log("tse were selected ", files)
                    setImage(files)
                  }
                }}
              />
            </div>
          </div>
          <div className="space-y-4">
            {question("3. Describe about the background which you want in your project")}
            <div className="">
              <ReactTextareaAutosize
                rows={3}
                minRows={3}
                placeholder="Write about the background here ..."
                maxRows={20}
                className="w-full resize-none rounded-lg p-4 shadow-md"
                onChange={(e) => {
                  setBackground(e.target.value)
                }}
              />
            </div>
          </div>
          <div className="space-y-4">
            {question("4. Choose the package you want")}
            <div className="">
              <div className="flex w-full flex-col gap-12 md:flex-row">
                {plans.map((plan, index) => {
                  return (
                    <PaymentPlans
                      key={index}
                      id={plan?.id}
                      title={plan?.title}
                      price={plan?.price}
                      currency={plan?.currency}
                      revision={Number(plan?.revision)}
                      selectedPlan={selectedPlan}
                      onclick={(val) => setselectedPlan(val)}
                      // printable={plan.printable}
                      delivery={plan?.delivery}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8 w-full gap-2 text-sm text-gray-500/75 sm:items-center sm:text-base md:flex md:flex-row">
          <CustomCheckbox
            id={"Agree terms"}
            checked={isTermsAndConditionsAccepted1}
            onChange={(check) => {
              setIsTermsAndConditionsAccepted1(check)
            }}
            variant="square"
          />
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum magni sint similique!
          Excepturi, ratione quia.
        </div>
        <div className="mb-8 w-full gap-2 text-sm text-gray-500/75 sm:items-center sm:text-base md:flex md:flex-row">
          <CustomCheckbox
            id={"Agree terms"}
            checked={isTermsAndConditionsAccepted2}
            onChange={(check) => {
              setIsTermsAndConditionsAccepted2(check)
            }}
            variant="square"
          />
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum magni sint similique!
          Excepturi, ratione quia.
        </div>
        <div className="mx-auto mt-4 md:w-[40%] md:min-w-[400px]">
          {areAllFieldsFilled && (
            <PaypalPayment amount={amount as string} CreateCommision={CreateCommision} />
          )}
          {/*           
          <Button
            variant="primary"
            className="w-full max-w-lg py-3"
            onClick={() => {
              CreateCommision()
            }}
          >
            Continue to Payment
          </Button> */}
        </div>
      </PayPalScriptProvider>
    </>
  )
}

export default CommissionOrder
{
  /* <PayPalScriptProvider options={initialOptions}> */
}
// </PayPalScriptProvider>
