import React from "react"

import CommissionStatus from "@/components/commissions/commission-status"
import MainLayout from "@/components/layout/layouts/main"

const CommissionSuccessPage = () => {
  return (
    <MainLayout>
      <CommissionStatus status="success" />
    </MainLayout>
  )
}

export default CommissionSuccessPage
