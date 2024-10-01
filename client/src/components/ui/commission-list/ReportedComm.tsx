import React from "react"

import CustomerCard from "@/components/ui/commision-card"

const ReportedComm = ({ reportedCommissions }: { reportedCommissions: CommissionData[] }) => {
  return <CustomerCard reportedCommissions={reportedCommissions} viewMode="double" />
}

export default ReportedComm
