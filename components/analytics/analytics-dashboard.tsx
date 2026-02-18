"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Calendar,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react"
import { exportToExcel, exportDataToPDF, formatAttendanceForExport, formatLeaveRequestsForExport } from "@/lib/export"
import {
  generateAttendanceAnalytics,
  generateLeaveAnalytics,
  generateStationAnalytics,
  generateUserAnalytics,
  generateTrendAnalytics,
  generateSummaryStats,
} from "@/lib/analytics"
import { mockUsers, mockAttendance, mockStations, mockLeaveRequests } from "@/lib/database-mock"

interface AnalyticsDashboardProps {
  className?: string
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [period, setPeriod] = React.useState<"daily" | "weekly" | "monthly">("daily")
  
  const attendanceData = React.useMemo(
    () => generateAttendanceAnalytics(period),
    [period]
  )
  
  const leaveData = React.useMemo(
    () => generateLeaveAnalytics(),
    []
  )
  
  const stationData = React.useMemo(
    () => generateStationAnalytics(),
    []
  )
  
  const userData = React.useMemo(
    () => generateUserAnalytics(),
    []
  )
  
  const trendData = React.useMemo(
    () => generateTrendAnalytics(),
    []
  )
  
  const summaryStats = React.useMemo(
    () => generateSummaryStats(),
    []
  )

  const handleExportExcel = () => {
    const attendanceExport = formatAttendanceForExport(mockAttendance, mockUsers, mockStations)
    const leaveExport = formatLeaveRequestsForExport(mockLeaveRequests, mockUsers)
    
    exportToExcel(attendanceExport, `attendance-analytics-${period}`, "Attendance Analytics")
    exportToExcel(leaveExport, `leave-analytics-${period}`, "Leave Analytics")
  }

  const handleExportPDF = () => {
    const attendanceExport = formatAttendanceForExport(mockAttendance, mockUsers, mockStations)
    exportDataToPDF(attendanceExport, `attendance-report-${new Date().toISOString().split("T")[0]}`, "Attendance Analytics Report")
  }

  // Chart colors
  const colors = {
    present: "#22c55e",
    late: "#eab308", 
    veryLate: "#f97316",
    absent: "#ef4444",
    sickLeave: "#3b82f6",
    personalLeave: "#8b5cf6",
    monthlyQuota: "#10b981",
    vacationLeave: "#f59e0b"
  }

  const pieColors = [colors.present, colors.late, colors.veryLate, colors.absent]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">แผนภูพและการวิเคราะห์ข้อมูลการเข้างาน</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button onClick={handleExportPDF} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อัตราเข้างานวันนี้</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.today.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {summaryStats.thisWeek.present} จาก {summaryStats.thisWeek.total} คน
            </p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คำขอลารออนุมัติ</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summaryStats.leaves.pending}</div>
            <p className="text-xs text-muted-foreground">รอดำเนินการ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สถานีที่ใช้งาน</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summaryStats.stations}</div>
            <p className="text-xs text-muted-foreground">จุดเช็คชื่อ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เปลี่ยนสัปดาห์</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {summaryStats.trends.weeklyChange > 0 ? "+" : ""}{summaryStats.trends.weeklyChange}%
            </div>
            <p className="text-xs text-muted-foreground">เทียบกับสัปดาห์ที่แล้ว</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">การเข้างาน</TabsTrigger>
          <TabsTrigger value="leave">การลา</TabsTrigger>
          <TabsTrigger value="stations">สถานี</TabsTrigger>
          <TabsTrigger value="users">พนักงาน</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Attendance Trend */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  แนวโน้มการเข้างาน ({period === "daily" ? "รายวัน" : period === "weekly" ? "รายสัปดาห์" : "รายเดือน"})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey={period === "daily" ? "date" : period === "weekly" ? "week" : "month"} className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="present" stackId="1" stroke={colors.present} fill={colors.present} name="มาปกติ" />
                      <Area type="monotone" dataKey="late" stackId="1" stroke={colors.late} fill={colors.late} name="มาสาย" />
                      <Area type="monotone" dataKey="veryLate" stackId="1" stroke={colors.veryLate} fill={colors.veryLate} name="มาสายมาก" />
                      <Area type="monotone" dataKey="absent" stackId="1" stroke={colors.absent} fill={colors.absent} name="ขาด" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Rate */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  อัตราการเข้างาน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey={period === "daily" ? "date" : period === "weekly" ? "week" : "month"} className="text-xs" />
                      <YAxis domain={[0, 100]} className="text-xs" />
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
                        dataKey="attendanceRate"
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

          {/* Attendance Distribution */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-primary" />
                สัดส่วนการเข้างาน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "มาปกติ", value: summaryStats.today.present },
                        { name: "มาสาย", value: summaryStats.today.late },
                        { name: "มาสายมาก", value: summaryStats.today.veryLate },
                        { name: "ขาด", value: summaryStats.today.absent },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieColors.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Leave Types */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  ประเภทการลา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={leaveData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="sickLeave" fill={colors.sickLeave} name="ลาป่วย" />
                      <Bar dataKey="personalLeave" fill={colors.personalLeave} name="ลากิจ" />
                      <Bar dataKey="monthlyQuota" fill={colors.monthlyQuota} name="หยุดประจำเดือน" />
                      <Bar dataKey="vacationLeave" fill={colors.vacationLeave} name="ลาพักผ่อน" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Leave Status */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  สถานะคำขอลา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={leaveData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="approved" stroke={colors.present} fill={colors.present} name="อนุมัติ" />
                      <Area type="monotone" dataKey="pending" stroke={colors.late} fill={colors.late} name="รออนุมัติ" />
                      <Area type="monotone" dataKey="rejected" stroke={colors.absent} fill={colors.absent} name="ปฏิเสธิต" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stations" className="space-y-4">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                สถิติการใช้งานสถานี
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stationData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="stationName" type="category" className="text-xs" width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="todayPresent" fill={colors.present} name="มาปกติวันนี้" />
                    <Bar dataKey="todayLate" fill={colors.late} name="มาสายวันนี้" />
                    <Bar dataKey="todayVeryLate" fill={colors.veryLate} name="มาสายมากวันนี้" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                สถิติพนักงาน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ชื่อ</th>
                      <th className="text-center p-2">อัตราเข้างาน</th>
                      <th className="text-center p-2">มาปกติ</th>
                      <th className="text-center p-2">มาสาย</th>
                      <th className="text-center p-2">ลาทั้งหมด</th>
                      <th className="text-center p-2">เวลาเฉลี่ย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map((user, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{user.userName}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </td>
                        <td className="text-center p-2">
                          <Badge variant={user.attendanceRate >= 90 ? "default" : user.attendanceRate >= 70 ? "secondary" : "destructive"}>
                            {user.attendanceRate}%
                          </Badge>
                        </td>
                        <td className="text-center p-2">{user.present}</td>
                        <td className="text-center p-2">{user.late + user.veryLate}</td>
                        <td className="text-center p-2">{user.totalLeaves}</td>
                        <td className="text-center p-2">{user.averageCheckInTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
