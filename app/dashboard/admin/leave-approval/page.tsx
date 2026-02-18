"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, CalendarDays, AlertCircle } from "lucide-react"

const pendingLeaveRequests = [
  {
    id: "1",
    staffName: "สมปอง ลางาน",
    staffEmail: "staff@checkchuea.local",
    type: "ลาป่วย",
    startDate: "25 ก.พ. 2569",
    endDate: "27 ก.พ. 2569",
    days: 3,
    reason: "ป่วดไข้ มีไข้",
    appliedAt: "18 ก.พ. 2569 14:30",
  },
  {
    id: "2",
    staffName: "สมมาย ไม่มา",
    staffEmail: "sommay@example.com",
    type: "ลากิจส่วนตัว",
    startDate: "26 ก.พ. 2569",
    endDate: "26 ก.พ. 2569",
    days: 1,
    reason: "ติดธุระส่วนตัว",
    appliedAt: "18 ก.พ. 2569 16:15",
  },
]

const processedRequests = [
  {
    id: "3",
    staffName: "สมหญิง รักงาน",
    staffEmail: "somying@example.com",
    type: "ลาป่วย",
    startDate: "20 ก.พ. 2569",
    endDate: "21 ก.พ. 2569",
    days: 2,
    reason: "ป่วยเป็นไข้",
    status: "approved",
    processedAt: "18 ก.พ. 2569 09:00",
    processedBy: "สมศักดิ์ ขยัน",
  },
  {
    id: "4",
    staffName: "สมคิด สายนิดหน่อย",
    staffEmail: "somkid@example.com",
    type: "ลากิจส่วนตัว",
    startDate: "15 ก.พ. 2569",
    endDate: "15 ก.พ. 2569",
    days: 1,
    reason: "ธุระส่วนตัว",
    status: "rejected",
    processedAt: "18 ก.พ. 2569 10:30",
    processedBy: "สมศักดิ์ ขยัน",
    rejectionReason: "ไม่มีเอกสารแนบ",
  },
]

export default function LeaveApprovalPage() {
  const handleApprove = (id: string) => {
    // In real app, this would call API
    console.log("Approve leave request:", id)
  }

  const handleReject = (id: string) => {
    // In real app, this would call API
    console.log("Reject leave request:", id)
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">อนุมัติการลา</h1>
          <p className="text-muted-foreground">ตรวจสอบและอนุมัติคำขอลาจากเจ้าหน้าที่</p>
        </div>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              คำขอลาที่รอออนุมัติ ({pendingLeaveRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingLeaveRequests.map((request) => (
              <div key={request.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{request.staffName}</p>
                      <p className="text-sm text-muted-foreground">{request.staffEmail}</p>
                    </div>
                    <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <span className="text-muted-foreground">ประเภท:</span>
                        <p className="font-medium">{request.type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">วันที่:</span>
                        <p className="font-medium">{request.startDate} - {request.endDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">จำนวน:</span>
                        <p className="font-medium">{request.days} วัน</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ส่งเมื่อ:</span>
                        <p className="font-medium">{request.appliedAt}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">เหตุผล:</span>
                      <p className="text-sm mt-1">{request.reason}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      อนุมัติ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      ปฏิเสธิต
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Processed Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              คำขอลาที่ดำเนินการแล้ว ({processedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {processedRequests.map((request) => (
              <div key={request.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{request.staffName}</p>
                      <p className="text-sm text-muted-foreground">{request.staffEmail}</p>
                      <Badge
                        className={
                          request.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {request.status === "approved" ? "อนุมัติแล้ว" : "ปฏิเสธิต"}
                      </Badge>
                    </div>
                    <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <span className="text-muted-foreground">ประเภท:</span>
                        <p className="font-medium">{request.type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">วันที่:</span>
                        <p className="font-medium">{request.startDate} - {request.endDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">จำนวน:</span>
                        <p className="font-medium">{request.days} วัน</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ดำเนินการ:</span>
                        <p className="font-medium">{request.processedAt}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">เหตุผล:</span>
                      <p className="text-sm mt-1">{request.reason}</p>
                    </div>
                    {request.status === "rejected" && (
                      <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          เหตุผลปฏิเสธิต: {request.rejectionReason}
                        </p>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      ดำเนินการโดย: {request.processedBy}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
