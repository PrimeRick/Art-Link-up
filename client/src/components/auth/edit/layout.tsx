import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { MdUploadFile } from "react-icons/md"
import { ImageListType } from "react-images-uploading"
import { toast } from "react-toastify"

import artistCategories from "@/data/categories.json"
import { useUserContext } from "@/providers/user-context"
import { fetchData, fetchFile } from "@/utils"
import generateRegex from "@/utils/generate-input-validation-regex"

import AuthLayout from "@/components/layout/layouts/auth"
import Button from "@/components/ui/button"
import ImageUpload from "@/components/ui/image-upload"
import Input from "@/components/ui/input"

interface EditLayoutProps {
  form: UseFormReturn<FieldValues, unknown, undefined>
  onSubmit: (data: FieldValues) => Promise<void>
  isArtist: boolean
  Artist: Allow
}

const EditLayout: React.FC<EditLayoutProps> = ({ form, onSubmit, Artist, isArtist }) => {
  interface FormData {
    [key: string]: string // Add an index signature
  }
  const { data: session } = useSession()

  const { user } = useUserContext()
  const [image, setImage] = useState<File | null | string>(null)
  const [image2, setImage2] = useState<File[] | string[] | null>(null)

  const [currentStyles, setCurrentStyles] = useState(
    artistCategories.artist.reduce((acc: Record<string, boolean>, option) => {
      acc[option.toLowerCase().split(" ").join("-")] = false
      return acc
    }, {})
  )

  useEffect(() => {
    const ct = Artist.category ? JSON.parse(Artist?.category || "{}") : null
    if (ct) {
      setCurrentStyles(ct)
    }
  }, [])

  const [formData, setFormData] = useState<FormData>({
    headline: Artist?.headline || "",
    location: Artist?.location || "",
    category: Artist?.category || "",
    instagram: Artist?.instagram || "",
    facebook: Artist?.facebook || "",
    twitter: Artist?.twitter || "",
    youtube: Artist?.youtube || "",
    twitch: Artist?.twitch || "",
    spotify: Artist?.spotify || "",
    soundcloud: Artist?.soundcloud || "",
    website: Artist?.website || "",
    bio: Artist?.bio || "",
    work: Artist?.work || "",
  })
  // console.log("artist is this one ", Artist)

  const artworks = Artist?.artwork || []

  const {
    register,
    clearErrors,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = form

  console.log(watch())

  const renderInputs = (
    placeholder: string,
    registrationName: string,
    type: React.HTMLInputTypeAttribute = "text",
    required: boolean = false
  ) => {
    const regex = generateRegex(type)
    // const urlRegex = /^(?!.(?:https?|ftp):\/\/[^\s]+).$/
    // const doesNotContainUrl = (value: string) => {
    //   return urlRegex.test(value)
    // }
    // const isRestrictedField = ["headline", "location", "bio", "work"].includes(registrationName)

    return (
      <Input
        mode="floating"
        type={type}
        className="w-full flex-1 grow overflow-hidden"
        variant="primary"
        placeholder={placeholder}
        onChangeHandler={(e) => setFormData({ ...formData, [registrationName]: e.target.value })}
        value={formData[registrationName]}
        errorHandling={{
          error:
            errors?.[registrationName]?.type === "required"
              ? placeholder + " is required"
              : errors?.[registrationName]?.message?.toString() ?? null,
          touched: touchedFields[registrationName],
          clear: () => clearErrors(registrationName),
        }}
        {...register(registrationName, {
          required: required,
          pattern: {
            // value: isRestrictedField ? urlRegex : regex.regex,
            value: regex.regex,
            message: regex.errorMessage ?? "Invalid " + placeholder,
          },
          minLength: {
            value: regex.minLength,
            message: "Minimum length is " + regex.minLength,
          },
          maxLength: {
            value: registrationName === "headline" ? 300 : regex.maxLength,
            message:
              "Maximum length is " + (registrationName === "headline" ? 300 : regex.maxLength),
          },
        })}
      />
    )
  }

  const AddContainer: React.FC = () => {
    return (
      <div className="h-50 w-50 center flex-col gap-6 rounded-md p-4 shadow-md">
        <div className="center h-12 w-12">
          <MdUploadFile className="h-full w-full opacity-50 transition-all hover:opacity-80" />
        </div>
        <span className="text-sm font-light leading-3 tracking-wide text-primary-gray">
          Click or <br />
          Drop here
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
        <Image
          src={src}
          alt=""
          height={200}
          width={200}
          className="h-full w-full object-cover object-center"
        />

        <div className="center -bottom-100 absolute h-0 w-full bg-gradient-radial from-black/50 via-black/40 to-transparent transition-all group-hover:bottom-0 group-hover:h-full">
          <div className="center hidden flex-col gap-2 group-hover:flex">
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
  const handleSendImage = async () => {
    toast.info("Uploading Image")
    const formdata = new FormData()
    formdata.append("file", image as File)
    const isuploaded = await fetchFile(
      "/v1/upload/file",
      session?.user?.name as string,
      "POST",
      formdata
    )
    if (isuploaded?.error) {
      toast.dismiss(isuploaded?.message)
    } else {
      toast.success("Image Uploaded")
      setImage(isuploaded?.data?.image?.Location || "")
      setTimeout(() => {
        fetchData(`/v1/users/${user?.id}`, session?.user?.name as string, "PATCH", {
          profileImage: isuploaded?.data?.image?.Location,
        })
      }, 200)
    }
  }
  const handleSendImage2 = async (): Promise<string[]> => {
    toast.info("Uploading Images")
    const formdata = new FormData()
    // console.log("uploading image files ")
    image2?.map((img) => {
      formdata.append("files", img as File)
    })
    const isuploaded = await fetchFile(
      "/v1/upload/multiple",
      session?.user?.name as string,
      "POST",
      formdata
    )
    if (isuploaded?.error) {
      toast.dismiss(isuploaded?.message)
      return []
    } else {
      toast.success("Images Uploaded")
      const newArray: string[] = []
      isuploaded?.data?.image?.map((loc: Allow) => {
        newArray.push(loc.Location)
      })
      setImage2([...newArray])
      return newArray
    }
  }
  const handleUploadImage = async () => {
    const arr = await handleSendImage2()
    const uploadArr = [...arr, ...Artist["artwork"]]
    // console.log("old stringarr", Artist["artwork"])
    // console.log("new stringarr", arr)
    // console.log("final arr ", uploadArr)
    await fetchData(`/v1/users/${user?.id}`, session?.user?.name as string, "PATCH", {
      artwork: uploadArr,
    })
  }
  return (
    <AuthLayout>
      <div className="center flex-col space-y-4 px-8 md:px-0">
        <h1>Profile Image</h1>
        <div className="flex flex-col gap-3">
          {/* for styling */}
          <ImageUpload
            multiple={false}
            maxNumber={1}
            AddContainer={AddContainer}
            ImageContainer={ImageContainer}
            className=""
            onChange={(value: ImageListType) => {
              if (value[0] && value[0].file) {
                setImage(value[0].file)
              }
            }}
          />
          <Button onClick={() => handleSendImage()} className="mb-8 w-full grow py-3">
            Upload
          </Button>
        </div>
        <div className="grid w-full grid-cols-1 gap-9 p-2 md:min-w-[680px]">
          {renderInputs("profile Title", "headline", "text", true)}
          {renderInputs("bio", "bio", "text", true)}
          {isArtist && renderInputs("commission Sheet", "work", "text", true)}
          {/* {isArtist && (
            <div className="border border-solid rounded-md border-secondary-white">
              <select
                id="dropdown"
                {...register("category")}
                className="block w-full py-2 pl-3 pr-12 mt-1 text-base text-gray-900 border-none rounded-md outline-none focus:outline-none focus:ring-0 "
              >
                <option value="">Choose art style</option>
                {artistCategories.artist.map((option) => (
                  <option key={option} value={option.toLowerCase().split(" ").join("-")}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )} */}
          {isArtist && (
            <div className="w-full">
              <h1 className="w-full text-center">Art Styles</h1>
              <div className="rounded-md ">
                {artistCategories.artist.map((option) => (
                  <label key={option} className="mt-2 block">
                    <input
                      type="checkbox"
                      name={option.toLowerCase().split(" ").join("-")}
                      // value={formData[option.toLowerCase().split(" ").join("-")]}
                      checked={currentStyles[option.toLowerCase().split(" ").join("-")]}
                      onChange={(e) => {
                        setCurrentStyles((prev) => {
                          const ct = { ...prev, [e.target.name]: e.target.checked }
                          setValue("category", JSON.stringify(ct ?? {}))
                          return ct
                        })
                      }}
                      // checked={selectedCategories.includes(option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="grid w-full grid-cols-1 gap-9 p-2 md:grid-cols-2">
          {/* {renderInputs("location", "location")}
          {renderInputs("work", "work")} */}
        </div>

        <h1>Socials</h1>
        {renderInputs("twitter", "twitter", "url")}
        {renderInputs("youtube", "youtube", "url")}
        {renderInputs("instagram", "instagram", "url")}
        {renderInputs("facebook", "facebook", "url")}
        {/* {renderInputs("twitch", "twitch", "url")}
        {renderInputs("spotify", "spotify", "url")}
        {renderInputs("soundcloud", "soundcloud", "url")}
        {renderInputs("website", "website", "url")} */}
        {isArtist && (
          <>
            <h1>Artworks</h1>
            <div>
              <ImageUpload
                multiple
                AddContainer={AddContainer}
                ImageContainer={ImageContainer}
                className="flex w-full resize-none flex-col items-center justify-end gap-4 rounded-lg p-4 shadow-md md:grid md:grid-cols-2 md:items-center md:justify-center md:gap-12"
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
                    setImage2(files)
                  }
                }}
              />
              <div className="flex w-full justify-center">
                <Button
                  onClick={() => {
                    if (image2?.length + artworks?.length < 3) {
                      toast.error("Please upload atleast 3 images")
                      return
                    }
                    handleUploadImage()
                  }}
                  className="mx-auto mb-10 mt-2 w-[60%] grow px-5 py-3 md:mx-32"
                >
                  Upload Images
                </Button>
              </div>
            </div>
          </>
        )}
        <Button
          onClick={() => {
            const lt = Object.keys(currentStyles)?.filter((key) => currentStyles[key])?.length ?? 0
            if (lt > 4) {
              toast.error("Please select only upto 4 styles")
              return
            }

            if (isArtist && lt === 0) {
              toast.error("Please select atleast 1 art style")
              return
            }

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
// flex-col w-64 h-64 gap-6 rounded-md shadow-md center
