import { useEffect } from "react"
import { useSession } from "next-auth/react"

import { fetchData } from "@/utils"
import { OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons } from "@paypal/react-paypal-js"

const PaypalPayment = ({
  amount,
  CreateCommision,
}: {
  amount: string
  CreateCommision: () => Promise<void>
}) => {
  const { data: session } = useSession()
  useEffect(() => {
    // console.log("comm  ", CreateCommision)
  }, [])
  const createOrder = async () => {
    try {
      // console.log("amount is going ", amount)
      const response = await fetchData(
        "/v1/payment/orders",
        session?.user?.name as string,
        "POST",
        {
          amount,
        }
      )
      // console.log("calling create order ", response?.data)
      return response?.data.captureOrder.id
    } catch (error) {
      // Handle error appropriately
      console.error("Error creating PayPal order:", error)
      //   throw error;
    }
  }

  const onApprove = async (data: OnApproveData) => {
    try {
      const response = await fetchData(
        `/v1/payment/orders/${data.orderID}/capture`,
        session?.user?.name as string,
        "POST"
      )
      if (response?.error) {
        // console.log(response.message)
        return
      }
      await CreateCommision()
      // console.log("payment approved ", response?.data)
      return response?.data
    } catch (error) {
      // Handle error appropriately
      console.error("Error capturing PayPal order:", error)
      // throw error;
    }
  }

  return (
    <PayPalButtons
      createOrder={async () => await createOrder()}
      onApprove={async (data) => await onApprove(data)}
      className="mx-auto w-full"
    />
  )
}

export default PaypalPayment
