"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, CalendarDays } from "lucide-react"

const historyItems = [
  { id: "1", date: "18 ก.พ. 2569", checkIn: "08:02", checkOut: "16:10", station: "จุดสแกน A - ด่านหลัก", status: "on_time" },
  { id: "2", date: "17 ก.พ. 2569", checkIn: "08:19", checkOut: "16:03", station: "จุดสแกน A - ด่านหลัก", status: "late" },
  { id: "3", date: "16 ก.พ. 2569", checkIn: "07:58", checkOut: "16:05", station: "จุดสแกน B - หน่วยพิทักษ์", status: "on_time" },
]

export default function HistoryPage() {
  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">ประวัติการเช็คชื่อ</h1>
          <p className="text-muted-foreground">ข้อมูลการเข้า-ออกงานย้อนหลังของคุณ</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              รายการย้อนหลัง
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {historyItems.map((item) => (
              <div key={item.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{item.date}</p>
                  <Badge className={item.status === "on_time" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                    {item.status === "on_time" ? "ตรงเวลา" : "มาสาย"}
                  </Badge>
                </div>
                <div className="mt-2 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                  <p className="flex items-center gap-1"><Clock className="w-4 h-4" /> เข้า {item.checkIn} น.</p>
                  <p className="flex items-center gap-1"><Clock className="w-4 h-4" /> ออก {item.checkOut} น.</p>
                  <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {item.station}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
