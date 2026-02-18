"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, PlusCircle, Calendar, AlertCircle } from "lucide-react"
import { getMonthlyLeaveQuota, getLeaveQuotaDescription, validateLeaveDates, calculateLeaveDays } from "@/lib/leave-quota"

const leaveRequests = [
  { id: "1", type: "ลาป่วย", dateRange: "20-21 ก.พ. 2569", status: "approved", days: 2 },
  { id: "2", type: "ลากิจ", dateRange: "05 ก.พ. 2569", status: "pending", days: 1 },
]

export default function LeavePage() {
  const [leaveType, setLeaveType] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const monthlyQuota = getMonthlyLeaveQuota(currentYear, currentMonth)
  const quotaDescription = getLeaveQuotaDescription(currentYear, currentMonth)

  // Calculate used days from existing requests
  const usedDays = leaveRequests
    .filter(r => r.status === "approved")
    .reduce((sum, r) => sum + r.days, 0)
  const remainingDays = monthlyQuota - usedDays

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!leaveType || !startDate || !endDate || !reason) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    const validation = validateLeaveDates(start, end, currentYear, currentMonth, [])
    if (!validation.valid) {
      setError(validation.error || "ข้อมูลไม่ถูกต้อง")
      return
    }

    const days = calculateLeaveDays(start, end)
    if (days > remainingDays) {
      setError(`ไม่สามารถลาได้ ${days} วัน เหลือวันลาคงเหลือ ${remainingDays} วัน`)
      return
    }

    // Simulate submission
    setSuccess(true)
    // Reset form
    setLeaveType("")
    setStartDate("")
    setEndDate("")
    setReason("")
  }

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">แจ้งลา</h1>
          <p className="text-muted-foreground">ส่งคำขอลาและติดตามสถานะ</p>
        </div>

        {/* Leave Quota Info */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="w-5 h-5 text-orange-500" />
              โควตาการลาประจำเดือน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <p className="text-3xl font-bold text-orange-600 mb-2">{monthlyQuota}</p>
                <p className="text-sm font-medium text-orange-700">วันที่หยุดได้</p>
                <p className="text-xs text-orange-600 mt-1">{quotaDescription}</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                <p className="text-3xl font-bold text-amber-600 mb-2">{usedDays}</p>
                <p className="text-sm font-medium text-amber-700">วันที่ใช้ไป</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <p className="text-3xl font-bold text-green-600 mb-2">{remainingDays}</p>
                <p className="text-sm font-medium text-green-700">วันที่เหลือ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Request Form */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <PlusCircle className="w-5 h-5 text-orange-500" />
              ส่งคำขอลาใหม่
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 mb-4">
                <Calendar className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">ส่งคำขอลาสำเร็จแล้ว รอการอนุมัติจากหัวหน้าสถานี</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="modern-input h-12 px-4 text-sm"
              >
                <option value="">เลือกประเภทการลา</option>
                <option value="หยุดประจำเดือน">หยุดประจำเดือน (ตามโควต้า)</option>
                <option value="ลาป่วย">ลาป่วย</option>
                <option value="ลากิจส่วนตัว">ลากิจส่วนตัว</option>
                <option value="ลาพักผ่อน">ลาพักผ่อน</option>
                <option value="ลาคลอดเรียน">ลาคลอดเรียน</option>
              </select>
              <div className="md:col-span-2 grid gap-3 md:grid-cols-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="วันที่เริ่ม"
                  min={new Date().toISOString().split('T')[0]}
                  className="modern-input h-12 px-4"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="วันที่สิ้นสุด"
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="modern-input h-12 px-4"
                />
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="เหตุผลการลา"
                className="md:col-span-2 modern-input min-h-[100px] px-4 py-3 resize-none"
              />
              <Button type="submit" className="md:col-span-2 modern-button bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                ยืนยันส่งคำขอ
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Leave History */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="w-5 h-5 text-orange-500" />
              ประวัติคำขอลา
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaveRequests.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{item.type}</p>
                  <p className="text-sm text-gray-600">{item.dateRange}</p>
                  <p className="text-xs text-gray-500 mt-1">จำนวน {item.days} วัน</p>
                </div>
                <Badge className={
                  item.status === "approved" 
                    ? "bg-green-100 text-green-700 border-green-200 px-3 py-1 rounded-lg" 
                    : "bg-amber-100 text-amber-700 border-amber-200 px-3 py-1 rounded-lg"
                }>
                  {item.status === "approved" ? "อนุมัติแล้ว" : "รออนุมัติ"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
