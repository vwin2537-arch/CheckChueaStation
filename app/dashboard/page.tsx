"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  TrendingUp,
  Clock,
  AlertTriangle,
  Download,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"

// Mock data
const attendanceData = [
  { day: "จ", present: 22, late: 3, absent: 0 },
  { day: "อ", present: 21, late: 2, absent: 2 },
  { day: "พ", present: 23, late: 1, absent: 1 },
  { day: "พฤ", present: 20, late: 4, absent: 1 },
  { day: "ศ", present: 24, late: 0, absent: 1 },
  { day: "ส", present: 10, late: 0, absent: 0 },
  { day: "อา", present: 8, late: 0, absent: 0 },
]

const weeklyTrend = [
  { week: "สัปดาห์ 1", rate: 92 },
  { week: "สัปดาห์ 2", rate: 88 },
  { week: "สัปดาห์ 3", rate: 95 },
  { week: "สัปดาห์ 4", rate: 91 },
]

const recentActivities = [
  {
    id: "1",
    staffName: "สมชาย ใจดี",
    action: "check_in" as const,
    station: "จุดสแกน A - ด่านหลัก",
    time: "08:02 น.",
    status: "on_time" as const,
  },
  {
    id: "2",
    staffName: "สมหญิง รักงาน",
    action: "check_in" as const,
    station: "จุดสแกน B - หน่วยพิทักษ์",
    time: "08:18 น.",
    status: "late" as const,
  },
  {
    id: "3",
    staffName: "สมศักดิ์ ขยัน",
    action: "check_out" as const,
    station: "จุดสแกน A - ด่านหลัก",
    time: "16:05 น.",
    status: "on_time" as const,
  },
  {
    id: "4",
    staffName: "สมศรี มาสาย",
    action: "check_in" as const,
    station: "จุดสแกน C - ป่าไม้",
    time: "08:45 น.",
    status: "very_late" as const,
  },
  {
    id: "5",
    staffName: "สมปอง ลางาน",
    action: "leave" as const,
    time: "ลาป่วย 2 วัน",
  },
]

const alerts = [
  {
    id: "1",
    type: "gps_mismatch" as const,
    staffName: "สมชาย ใจดี",
    description: "GPS ห่างจากจุดสแกน 2.3 กม.",
    time: "08:02 น.",
    resolved: false,
  },
  {
    id: "2",
    type: "late" as const,
    staffName: "สมศรี มาสาย",
    description: "เช็คชื่อสายเกิน 30 นาที",
    time: "08:45 น.",
    resolved: false,
  },
  {
    id: "3",
    type: "suspicious" as const,
    staffName: "สมหญิง รักงาน",
    description: "มือถือเครื่องเดียวสแกน 2 คน",
    time: "08:20 น.",
    resolved: false,
  },
]

export default function DashboardPage() {
  const [role, setRole] = React.useState<"admin" | "staff">("admin")

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">แดชบอร์ด</h1>
            <p className="text-muted-foreground">
              ภาพรวมระบบเช็คชื่อวันนี้ (18 กุมภาพันธ์ 2569)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              ส่งออกรายงาน
            </Button>
            <Button size="sm" onClick={() => setRole(role === "admin" ? "staff" : "admin")}>
              สลับบทบาท ({role === "admin" ? "Admin" : "Staff"})
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="เจ้าหน้าที่ทั้งหมด"
            value={25}
            description="เจ้าหน้าที่ปฏิบัติงาน"
            icon={Users}
            variant="default"
          />
          <StatCard
            title="มาแล้ววันนี้"
            value={20}
            description="ตรงเวลา 18 คน, สาย 2 คน"
            icon={UserCheck}
            trend={{ value: 5, isPositive: true }}
            variant="success"
          />
          <StatCard
            title="สาย"
            value={3}
            description="เฉลี่ย 12 นาที"
            icon={Clock}
            trend={{ value: 2, isPositive: false }}
            variant="warning"
          />
          <StatCard
            title="ขาด / ลา"
            value={2}
            description="ขาด 0 คน, ลา 2 คน"
            icon={UserX}
            variant="default"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                สถิติรายสัปดาห์
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="present" name="ตรงเวลา" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" name="สาย" fill="#eab308" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="ขาด" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Rate Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                แนวโน้มอัตราการมาทำงาน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis domain={[80, 100]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "อัตรา"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                กิจกรรมล่าสุด
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity activities={recentActivities} />
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                การแจ้งเตือน
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  {alerts.filter((a) => !a.resolved).length} รายการรอตรวจสอบ
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AlertsPanel alerts={alerts} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
