"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <DashboardLayout role="admin">
      <AnalyticsDashboard />
    </DashboardLayout>
  )
}
