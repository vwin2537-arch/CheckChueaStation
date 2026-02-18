"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, AlertCircle, TrendingUp, Download, RefreshCw } from "lucide-react"
import { exportToExcel, exportDataToPDF, formatAttendanceForExport } from "@/lib/export"
import { mockUsers, mockAttendance, mockStations, mockLeaveRequests } from "@/lib/database-mock"

interface DashboardStats {
  totalStaff: number
  present: number
  late: number
  veryLate: number
  absent: number
  pendingLeaves: number
}

interface RealTimeDashboardProps {
  className?: string
}

export function RealTimeDashboard({ className }: RealTimeDashboardProps) {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalStaff: 0,
    present: 0,
    late: 0,
    veryLate: 0,
    absent: 0,
    pendingLeaves: 0,
  })
  const [recentAttendance, setRecentAttendance] = React.useState<any[]>([])
  const [recentLeaveRequests, setRecentLeaveRequests] = React.useState<any[]>([])
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date())

  // Calculate initial stats
  React.useEffect(() => {
    calculateStats()
    const interval = setInterval(() => {
      calculateStats()
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const calculateStats = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayAttendance = mockAttendance.filter(
      record => new Date(record.checkInAt) >= today
    )
    
    const presentCount = todayAttendance.filter(r => r.status === 'ON_TIME').length
    const lateCount = todayAttendance.filter(r => r.status === 'LATE').length
    const veryLateCount = todayAttendance.filter(r => r.status === 'VERY_LATE').length
    const absentCount = mockUsers.length - todayAttendance.length
    const pendingLeaveRequests = mockLeaveRequests.filter(r => r.status === 'PENDING')
    
    setStats({
      totalStaff: mockUsers.length,
      present: presentCount,
      late: lateCount,
      veryLate: veryLateCount,
      absent: absentCount,
      pendingLeaves: pendingLeaveRequests.length,
    })
    
    setRecentAttendance(todayAttendance.slice(-5).reverse())
    setRecentLeaveRequests(pendingLeaveRequests.slice(-5).reverse())
    setLastUpdate(new Date())
  }

  const handleExportExcel = () => {
    const attendanceData = formatAttendanceForExport(mockAttendance, mockUsers, mockStations)
    exportToExcel(attendanceData, `attendance-report-${new Date().toISOString().split('T')[0]}`, 'Attendance Report')
  }

  const handleExportPDF = () => {
    const attendanceData = formatAttendanceForExport(mockAttendance, mockUsers, mockStations)
    exportDataToPDF(attendanceData, `attendance-report-${new Date().toISOString().split('T')[0]}`, 'Attendance Report')
  }

  const getAttendanceRate = () => {
    const totalPresent = stats.present + stats.late + stats.veryLate
    return stats.totalStaff > 0 ? Math.round((totalPresent / stats.totalStaff) * 100) : 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TIME': return 'bg-green-100 text-green-700'
      case 'LATE': return 'bg-yellow-100 text-yellow-700'
      case 'VERY_LATE': return 'bg-orange-100 text-orange-700'
      case 'ABSENT': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ON_TIME': return 'มาปกติ'
      case 'LATE': return 'มาสาย'
      case 'VERY_LATE': return 'มาสายมาก'
      case 'ABSENT': return 'ขาด'
      default: return status
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with export buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">แดชบอร์ดแบบ Real-time</h1>
          <p className="text-muted-foreground">
            อัปเดตอัตโนมัติทุก 5 วินาที • อัปเดตล่าสุด: {lastUpdate.toLocaleTimeString('th-TH')}
          </p>
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
          <Button onClick={calculateStats} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            รีเฟรช
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">พนักงานทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">คน</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มาปกติ</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-muted-foreground">คน</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มาสาย</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late + stats.veryLate}</div>
            <p className="text-xs text-muted-foreground">คน</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อัตราเข้างาน</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{getAttendanceRate()}%</div>
            <p className="text-xs text-muted-foreground">เข้างานแล้ว</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Attendance */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              เช็คชื่อล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">ยังไม่มีข้อมูลเช็คชื่อวันนี้</p>
              ) : (
                recentAttendance.map((record) => {
                  const user = mockUsers.find(u => u.id === record.userId)
                  const station = mockStations.find(s => s.id === record.stationId)
                  
                  return (
                    <div key={record.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{user?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{station?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(record.checkInAt).toLocaleTimeString('th-TH')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusText(record.status)}
                      </Badge>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Leave Requests */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              คำขอลารออนุมัติ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeaveRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">ไม่มีคำขอลารออนุมัติ</p>
              ) : (
                recentLeaveRequests.map((request) => {
                  const user = mockUsers.find(u => u.id === request.userId)
                  
                  return (
                    <div key={request.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{user?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{request.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.startDate).toLocaleDateString('th-TH')} - {new Date(request.endDate).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1 rounded-lg">
                        รออนุมัติ
                      </Badge>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
