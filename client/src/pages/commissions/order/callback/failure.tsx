import React from "react"

import CommissionStatus from "@/components/commissions/commission-status"
import MainLayout from "@/components/layout/layouts/main"

const CommissionFailurePage = () => {
  return (
    <MainLayout>
      <CommissionStatus status="failure" />
    </MainLayout>
  )
}

export default CommissionFailurePage
