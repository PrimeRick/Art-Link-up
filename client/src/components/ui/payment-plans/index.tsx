import React from "react"

interface PaymentPlanProps {
  id: string
  title: string
  price: number
  currency: string
  revision?: number
  // figure: number
  // printable: boolean
  delivery: string
  onclick: (id: string) => void
  selectedPlan: string | null
}

const PaymentPlans: React.FC<PaymentPlanProps> = ({
  id,
  title,
  price,
  currency,
  selectedPlan,
  revision,
  // figure,
  // printable,
  delivery,
  onclick,
}) => {
  return (
    <div
      className="group flex w-full cursor-pointer gap-4"
      onClick={() => {
        onclick(id)
      }}
    >
      {selectedPlan === id ? (
        <div className="aspect-square !h-5 !w-5 overflow-hidden rounded-full border border-solid border-secondary-gray/30 p-1">
          <div className="h-full w-full rounded-full bg-primary-black" />
        </div>
      ) : (
        <div className="aspect-square !h-5 !w-5 overflow-hidden rounded-full border border-solid border-secondary-gray/30 p-1">
          <div className="h-full w-full rounded-full" />
        </div>
      )}
      <div className="w-full max-w-lg space-y-2 rounded-lg px-12 py-2 shadow-md">
        <h2 className="text-2xl">{title} Plan</h2>
        <h3 className="text-xl">
          {currency} {price}
        </h3>
        <div className="flex flex-col items-start">
          {revision && (
            <div className="center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M10 1.5L4.5 6.5L2 4.22727"
                  stroke="#616161"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {revision} Revisions
            </div>
          )}
          {/* {figure && (
            <div className="gap-4 center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M10 1.5L4.5 6.5L2 4.22727"
                  stroke="#616161"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {figure} Figures
            </div>
          )} */}
          {/* {printable && (
            <div className="gap-4 center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M10 1.5L4.5 6.5L2 4.22727"
                  stroke="#616161"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Printable
            </div>
          )} */}
          {delivery && (
            <div className="center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M10 1.5L4.5 6.5L2 4.22727"
                  stroke="#616161"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {delivery}
              {" days"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentPlans
