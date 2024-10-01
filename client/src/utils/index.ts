import { AxiosRequestConfig } from "axios"
import { signOut } from "next-auth/react"
import { toast } from "react-toastify"

import instance, { fileInstance } from "@/lib/axios"

export const fetchWithAuthorization = async (
  url: string,
  token: string,
  method: string,
  data?: AxiosRequestConfig["data"],
  customHeaders?: { [key: string]: string }
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...customHeaders,
  }

  return instance.request({
    url,
    method,
    data,
    headers,
  })
}

export const fetchData = async (
  url: string,
  token: string,
  method: string,
  data?: Allow,
  customHeaders?: { [key: string]: string },
  session?: Allow
): Promise<APITypes | null> => {
  try {
    // if( window!==undefined && navigator && !navigator.onLine)
    // {
    //   throw new Error("No Network Connection")

    // }
    const response = await fetchWithAuthorization(url, token, method, data, customHeaders)

    const resp = response.data
    if (resp?.error) {
      if (!session) {
        signOut()
      }
    }
    return await resp
  } catch (error: Allow) {
    return {
      error: error,
      message: error?.response?.data?.message,
      data: null,
    }
  }
}
export const fetchWithoutAuthorization = async (
  url: string,
  method: string,
  data?: Allow,
  customHeaders?: { [key: string]: string }
): Promise<APITypes | null> => {
  try {
    const response = await instance.request({
      url,
      method,
      data,
      headers: customHeaders,
    })

    const resp = response.data
    return await resp
  } catch (error: unknown) {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      error: error,
      message: "Request failed",
      data: null,
    }
  }
}
export const fetchFile = async (
  url: string,
  token: string,
  method: string,
  data?: Allow,
  customHeaders?: { [key: string]: string }
): Promise<APITypes | null> => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      ...customHeaders,
    }
    const response = await fileInstance.request({
      url,
      method,
      headers,
      data,
    })
    const resp = await response.data
    if (resp?.error) {
      toast.info(resp?.message)
      // return
    }
    return resp
  } catch (error) {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      error: error,
      message: "Request failed",
      data: null,
    }
  }
}

export const isValidURL = (str: string): boolean => {
  if (
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      str
    )
  ) {
    return true
  } else {
    return false
  }
}
