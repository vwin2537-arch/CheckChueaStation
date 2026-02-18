"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileBarChart2, CalendarDays, FileSpreadsheet, FileText } from "lucide-react"
import { exportToExcel, exportDataToPDF, exportToCSV, formatAttendanceForExport, formatLeaveRequestsForExport } from "@/lib/export"
import { mockAttendance, mockLeaveRequests, mockStations, mockUsers } from "@/lib/database-mock"

const reportItems = [
  { id: "1", name: "สรุปการเข้างานรายวัน", period: "วันนี้", updatedAt: "18 ก.พ. 2569 17:30" },
  { id: "2", name: "สรุปการมาสายรายสัปดาห์", period: "สัปดาห์นี้", updatedAt: "18 ก.พ. 2569 17:10" },
  { id: "3", name: "สถิติการลารายเดือน", period: "เดือนนี้", updatedAt: "18 ก.พ. 2569 16:55" },
]

export default function ReportsPage() {
  const attendanceExport = React.useMemo(
    () => formatAttendanceForExport(mockAttendance, mockUsers, mockStations),
    []
  )
  const leaveExport = React.useMemo(() => formatLeaveRequestsForExport(mockLeaveRequests, mockUsers), [])

  const handleExportAllExcel = () => {
    exportToExcel(attendanceExport, `attendance-report-${new Date().toISOString().split("T")[0]}`, "Attendance")
    exportToExcel(leaveExport, `leave-report-${new Date().toISOString().split("T")[0]}`, "Leave")
  }

  const handleExportAllPDF = () => {
    exportDataToPDF(attendanceExport, `attendance-report-${new Date().toISOString().split("T")[0]}`, "Attendance Report")
    exportDataToPDF(leaveExport, `leave-report-${new Date().toISOString().split("T")[0]}`, "Leave Report")
  }

  const handleExportCSV = () => {
    exportToCSV(attendanceExport, `attendance-report-${new Date().toISOString().split("T")[0]}`)
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">รายงาน</h1>
            <p className="text-muted-foreground">ดูและส่งออกข้อมูลสรุปการปฏิบัติงาน</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExportAllExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" onClick={handleExportAllPDF}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-sm">จำนวนเจ้าหน้าที่</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockUsers.length}</p>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-sm">ข้อมูลเช็คชื่อ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockAttendance.length}</p>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-sm">คำขอลา</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockLeaveRequests.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart2 className="h-5 w-5 text-primary" />
              รายงานที่พร้อมใช้งาน
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reportItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">ช่วงข้อมูล: {item.period}</p>
                  <p className="text-xs text-muted-foreground">อัปเดตล่าสุด: {item.updatedAt}</p>
                </div>
                <Button variant="outline" size="sm">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  เปิดรายงาน
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
