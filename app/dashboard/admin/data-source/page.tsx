"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataSourceSwitch } from "@/components/admin/data-source-switch"

export default function DataSourcePage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Data Source Management</h1>
          <p className="text-muted-foreground">
            Switch between mock data and real database
          </p>
        </div>
        
        <DataSourceSwitch />
      </div>
    </DashboardLayout>
  )
}
