"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, MapPin, ShieldAlert } from "lucide-react"

const alertItems = [
  {
    id: "1",
    title: "ตรวจพบ GPS ไม่ตรงจุดสแกน",
    detail: "สมศรี มาสาย อยู่ห่างจุดสแกน C ประมาณ 2.1 กม.",
    level: "high",
    time: "08:45 น.",
    icon: MapPin,
  },
  {
    id: "2",
    title: "พบการใช้อุปกรณ์ซ้ำ",
    detail: "อุปกรณ์เดียวกันถูกใช้เช็คชื่อ 2 บัญชีใน 10 นาที",
    level: "medium",
    time: "08:20 น.",
    icon: ShieldAlert,
  },
  {
    id: "3",
    title: "เจ้าหน้าที่เช็คชื่อสาย",
    detail: "สมหญิง รักงาน เช็คชื่อสาย 18 นาที",
    level: "low",
    time: "08:18 น.",
    icon: AlertTriangle,
  },
]

export default function AlertsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">แจ้งเตือน</h1>
          <p className="text-muted-foreground">ติดตามความผิดปกติและเหตุการณ์สำคัญแบบเรียลไทม์</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              รายการแจ้งเตือนล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertItems.map((item) => {
              const LevelIcon = item.icon
              const levelClass =
                item.level === "high"
                  ? "bg-red-100 text-red-700"
                  : item.level === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"

              const levelLabel =
                item.level === "high" ? "รุนแรง" : item.level === "medium" ? "ปานกลาง" : "ทั่วไป"

              return (
                <div key={item.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <LevelIcon className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                    <Badge className={levelClass}>{levelLabel}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">เวลา: {item.time}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
