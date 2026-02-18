"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RealTimeDashboard } from "@/components/dashboard/real-time-dashboard"

export default function RealtimeDashboardPage() {
  return (
    <DashboardLayout role="admin">
      <RealTimeDashboard />
    </DashboardLayout>
  )
}
