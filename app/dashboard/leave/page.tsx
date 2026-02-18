"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, PlusCircle } from "lucide-react"

const leaveRequests = [
  { id: "1", type: "ลาป่วย", dateRange: "20-21 ก.พ. 2569", status: "approved" },
  { id: "2", type: "ลากิจ", dateRange: "05 ก.พ. 2569", status: "pending" },
]

export default function LeavePage() {
  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">แจ้งลา</h1>
          <p className="text-muted-foreground">ส่งคำขอลาและติดตามสถานะ</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-primary" />
              ส่งคำขอลาใหม่
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input placeholder="ประเภทการลา (เช่น ลาป่วย)" />
            <Input placeholder="ช่วงวันที่ลา" />
            <Input placeholder="เหตุผล" className="md:col-span-2" />
            <Button className="md:col-span-2">ยืนยันส่งคำขอ</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              ประวัติคำขอลา
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaveRequests.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{item.type}</p>
                  <p className="text-sm text-muted-foreground">{item.dateRange}</p>
                </div>
                <Badge className={item.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
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
