"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  MapPin,
  Calendar,
  UserCheck,
  UserX,
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"

// Mock data for staff
const staffData = {
  name: "สมชาย ใจดี",
  position: "เจ้าหน้าที่ป้องกันไฟป่า",
  station: "จุดสแกน A - ด่านหลัก",
  shift: "กะเช้า (08:00 - 16:00)",
  todayStatus: {
    checkedIn: true,
    checkedInTime: "08:02 น.",
    checkedOut: false,
    checkedOutTime: null,
    status: "on_time" as const,
  },
  monthlyStats: {
    present: 18,
    late: 2,
    absent: 0,
    leave: 1,
  },
}

export default function StaffDashboardPage() {
  const [showScanner, setShowScanner] = React.useState(false)

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* User Profile Card */}
        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-white">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback className="text-orange-600 text-xl">สมชาย</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{staffData.name}</h2>
                <p className="text-white/80 text-sm">{staffData.position}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-white/90">
                  <MapPin className="w-4 h-4" />
                  <span>{staffData.station}</span>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-white/20 text-white border-white/30">
                  {staffData.shift}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              สถานะวันนี้
              <Badge className="ml-auto bg-green-500">กะเช้า</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Check In */}
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-5 h-5 text-green-500" />
                  <span className="font-medium">เช็คชื่อเข้า</span>
                </div>
                {staffData.todayStatus.checkedIn ? (
                  <>
                    <p className="text-2xl font-bold text-green-600">
                      {staffData.todayStatus.checkedInTime}
                    </p>
                    <Badge className="mt-2 bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      ตรงเวลา
                    </Badge>
                  </>
                ) : (
                  <p className="text-muted-foreground">ยังไม่ได้เช็คชื่อ</p>
                )}
              </div>

              {/* Check Out */}
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <UserX className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">เช็คชื่อออก</span>
                </div>
                {staffData.todayStatus.checkedOut ? (
                  <>
                    <p className="text-2xl font-bold text-green-600">
                      {staffData.todayStatus.checkedOutTime}
                    </p>
                    <Badge className="mt-2 bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      เรียบร้อย
                    </Badge>
                  </>
                ) : (
                  <p className="text-muted-foreground">รอเช็คชื่อออก</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-in/out Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                className="h-24 text-lg flex flex-col gap-1"
                disabled={staffData.todayStatus.checkedIn && !staffData.todayStatus.checkedOut}
                onClick={() => setShowScanner(true)}
              >
                <QrCode className="w-8 h-8" />
                {staffData.todayStatus.checkedIn ? "เช็คชื่อเข้าแล้ว" : "เช็คชื่อเข้า"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-24 text-lg flex flex-col gap-1"
                disabled={!staffData.todayStatus.checkedIn || staffData.todayStatus.checkedOut}
                onClick={() => setShowScanner(true)}
              >
                <QrCode className="w-8 h-8" />
                {staffData.todayStatus.checkedOut ? "เช็คชื่อออกแล้ว" : "เช็คชื่อออก"}
              </Button>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    วิธีเช็คชื่อ
                  </p>
                  <ol className="mt-1 text-yellow-700 dark:text-yellow-300 list-decimal list-inside space-y-1">
                    <li>กดปุ่ม "เช็คชื่อเข้า" หรือ "เช็คชื่อออก"</li>
                    <li>สแกน QR Code ที่จุดสแกน</li>
                    <li>ระบบจะตรวจสอบ GPS และอุปกรณ์</li>
                    <li>ถ่ายเซลฟี่เพื่อยืนยันตัวตน</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              สถิติเดือนนี้ (กุมภาพันธ์)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col items-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="w-6 h-6 text-green-500 mb-1" />
                <span className="text-2xl font-bold text-green-600">{staffData.monthlyStats.present}</span>
                <span className="text-xs text-muted-foreground">ตรงเวลา</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <Clock className="w-6 h-6 text-yellow-500 mb-1" />
                <span className="text-2xl font-bold text-yellow-600">{staffData.monthlyStats.late}</span>
                <span className="text-xs text-muted-foreground">สาย</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                <XCircle className="w-6 h-6 text-red-500 mb-1" />
                <span className="text-2xl font-bold text-red-600">{staffData.monthlyStats.absent}</span>
                <span className="text-xs text-muted-foreground">ขาด</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Calendar className="w-6 h-6 text-blue-500 mb-1" />
                <span className="text-2xl font-bold text-blue-600">{staffData.monthlyStats.leave}</span>
                <span className="text-xs text-muted-foreground">ลา</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">อัตราการมาทำงาน</span>
              <span className="font-bold text-green-600">95%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "95%" }} />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-16 flex flex-col gap-1">
            <Calendar className="w-5 h-5" />
            <span>ดูประวัติ</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col gap-1">
            <UserX className="w-5 h-5" />
            <span>แจ้งลา</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
