import { mockUsers, mockAttendance, mockStations, mockLeaveRequests } from './database-mock'

// Analytics data generators
export function generateAttendanceAnalytics(period: 'daily' | 'weekly' | 'monthly') {
  const today = new Date()
  const data = []
  
  if (period === 'daily') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dayStart = new Date(date)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)
      
      const dayAttendance = mockAttendance.filter(
        record => record.checkInAt >= dayStart && record.checkInAt <= dayEnd
      )
      
      const present = dayAttendance.filter(r => r.status === 'ON_TIME').length
      const late = dayAttendance.filter(r => r.status === 'LATE').length
      const veryLate = dayAttendance.filter(r => r.status === 'VERY_LATE').length
      const absent = mockUsers.length - dayAttendance.length
      
      data.push({
        date: date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
        fullDate: date.toISOString().split('T')[0],
        present,
        late,
        veryLate,
        absent,
        total: present + late + veryLate + absent,
        attendanceRate: Math.round(((present + late + veryLate) / mockUsers.length) * 100)
      })
    }
  } else if (period === 'weekly') {
    // Last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - (today.getDay() + (i * 7)))
      weekStart.setHours(0, 0, 0, 0)
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)
      
      const weekAttendance = mockAttendance.filter(
        record => record.checkInAt >= weekStart && record.checkInAt <= weekEnd
      )
      
      const present = weekAttendance.filter(r => r.status === 'ON_TIME').length
      const late = weekAttendance.filter(r => r.status === 'LATE').length
      const veryLate = weekAttendance.filter(r => r.status === 'VERY_LATE').length
      const absent = mockUsers.length * 5 - weekAttendance.length // 5 working days
      
      data.push({
        week: `สัปดาห์ที่ ${4 - i}`,
        startDate: weekStart.toLocaleDateString('th-TH'),
        endDate: weekEnd.toLocaleDateString('th-TH'),
        present,
        late,
        veryLate,
        absent,
        total: present + late + veryLate + absent,
        attendanceRate: Math.round(((present + late + veryLate) / (mockUsers.length * 5)) * 100)
      })
    }
  } else {
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0)
      
      const monthAttendance = mockAttendance.filter(
        record => record.checkInAt >= monthStart && record.checkInAt <= monthEnd
      )
      
      const workingDays = getWorkingDaysInMonth(monthStart)
      const present = monthAttendance.filter(r => r.status === 'ON_TIME').length
      const late = monthAttendance.filter(r => r.status === 'LATE').length
      const veryLate = monthAttendance.filter(r => r.status === 'VERY_LATE').length
      const absent = (mockUsers.length * workingDays) - monthAttendance.length
      
      data.push({
        month: monthStart.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }),
        present,
        late,
        veryLate,
        absent,
        total: present + late + veryLate + absent,
        attendanceRate: Math.round(((present + late + veryLate) / (mockUsers.length * workingDays)) * 100)
      })
    }
  }
  
  return data
}

export function generateLeaveAnalytics() {
  const today = new Date()
  const data = []
  
  // Last 6 months leave data
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0)
    
    const monthLeaves = mockLeaveRequests.filter(
      request => request.startDate >= monthStart && request.startDate <= monthEnd
    )
    
    const sickLeave = monthLeaves.filter(r => r.type === 'SICK_LEAVE').length
    const personalLeave = monthLeaves.filter(r => r.type === 'PERSONAL_LEAVE').length
    const monthlyQuota = monthLeaves.filter(r => r.type === 'MONTHLY_QUOTA').length
    const vacationLeave = monthLeaves.filter(r => r.type === 'VACATION_LEAVE').length
    
    const approved = monthLeaves.filter(r => r.status === 'APPROVED').length
    const pending = monthLeaves.filter(r => r.status === 'PENDING').length
    const rejected = monthLeaves.filter(r => r.status === 'REJECTED').length
    
    data.push({
      month: monthStart.toLocaleDateString('th-TH', { month: 'short', year: 'numeric' }),
      sickLeave,
      personalLeave,
      monthlyQuota,
      vacationLeave,
      totalDays: monthLeaves.reduce((sum, r) => sum + r.days, 0),
      approved,
      pending,
      rejected,
      total: monthLeaves.length
    })
  }
  
  return data
}

export function generateStationAnalytics() {
  return mockStations.map(station => {
    const stationAttendance = mockAttendance.filter(r => r.stationId === station.id)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayAttendance = stationAttendance.filter(r => r.checkInAt >= today)
    
    const present = todayAttendance.filter(r => r.status === 'ON_TIME').length
    const late = todayAttendance.filter(r => r.status === 'LATE').length
    const veryLate = todayAttendance.filter(r => r.status === 'VERY_LATE').length
    
    return {
      stationName: station.name,
      location: station.location,
      todayPresent: present,
      todayLate: late,
      todayVeryLate: veryLate,
      todayTotal: present + late + veryLate,
      totalUsage: stationAttendance.length,
      averageDaily: Math.round(stationAttendance.length / 30) // Last 30 days average
    }
  })
}

export function generateUserAnalytics() {
  return mockUsers.map(user => {
    const userAttendance = mockAttendance.filter(r => r.userId === user.id)
    const userLeaves = mockLeaveRequests.filter(r => r.userId === user.id)
    
    const present = userAttendance.filter(r => r.status === 'ON_TIME').length
    const late = userAttendance.filter(r => r.status === 'LATE').length
    const veryLate = userAttendance.filter(r => r.status === 'VERY_LATE').length
    
    const totalDays = userAttendance.length
    const attendanceRate = totalDays > 0 ? Math.round(((present + late + veryLate) / totalDays) * 100) : 0
    
    const approvedLeaves = userLeaves.filter(r => r.status === 'APPROVED').length
    const pendingLeaves = userLeaves.filter(r => r.status === 'PENDING').length
    
    return {
      userName: user.name,
      email: user.email,
      role: user.role,
      present,
      late,
      veryLate,
      absentDays: 0, // Would need date range calculation
      attendanceRate,
      totalLeaves: userLeaves.length,
      approvedLeaves,
      pendingLeaves,
      averageCheckInTime: calculateAverageCheckInTime(userAttendance)
    }
  })
}

export function generateTrendAnalytics() {
  const attendanceData = generateAttendanceAnalytics('daily')
  
  return {
    attendanceTrend: attendanceData.map(d => ({
      date: d.date,
      rate: d.attendanceRate,
      present: d.present,
      absent: d.absent
    })),
    lateTrend: attendanceData.map(d => ({
      date: d.date,
      late: d.late,
      veryLate: d.veryLate,
      totalLate: d.late + d.veryLate
    })),
    weeklyComparison: {
      thisWeek: attendanceData.slice(-7).reduce((acc, d) => ({
        present: acc.present + d.present,
        absent: acc.absent + d.absent,
        total: acc.total + d.total
      }), { present: 0, absent: 0, total: 0 }),
      lastWeek: attendanceData.slice(-14, -7).reduce((acc, d) => ({
        present: acc.present + d.present,
        absent: acc.absent + d.absent,
        total: acc.total + d.total
      }), { present: 0, absent: 0, total: 0 }),
      change: 0
    },
    monthlyTrend: generateAttendanceAnalytics('monthly')
  }
}

// Helper functions
function getWorkingDaysInMonth(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  let workingDays = 0
  for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
    const dayOfWeek = day.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Saturday or Sunday
      workingDays++
    }
  }
  
  return workingDays
}

function calculateWeeklyComparison() {
  const weeklyData = generateAttendanceAnalytics('weekly')
  
  return {
    thisWeek: weeklyData[weeklyData.length - 1] || {},
    lastWeek: weeklyData[weeklyData.length - 2] || {},
    change: weeklyData.length >= 2 ? 
      weeklyData[weeklyData.length - 1].attendanceRate - weeklyData[weeklyData.length - 2].attendanceRate : 0
  }
}

function calculateAverageCheckInTime(attendance: any[]): string {
  if (attendance.length === 0) return '-'
  
  const times = attendance
    .filter(r => r.checkInAt)
    .map(r => {
      const date = new Date(r.checkInAt)
      return date.getHours() * 60 + date.getMinutes()
    })
  
  if (times.length === 0) return '-'
  
  const avgMinutes = Math.round(times.reduce((sum, time) => sum + time, 0) / times.length)
  const hours = Math.floor(avgMinutes / 60)
  const minutes = avgMinutes % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export function generateSummaryStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayAttendance = mockAttendance.filter(r => r.checkInAt >= today)
  const present = todayAttendance.filter(r => r.status === 'ON_TIME').length
  const late = todayAttendance.filter(r => r.status === 'LATE').length
  const veryLate = todayAttendance.filter(r => r.status === 'VERY_LATE').length
  const absent = mockUsers.length - todayAttendance.length
  
  const pendingLeaves = mockLeaveRequests.filter(r => r.status === 'PENDING')
  const approvedLeaves = mockLeaveRequests.filter(r => r.status === 'APPROVED')
  
  const weeklyData = generateAttendanceAnalytics('weekly')
  const monthlyData = generateAttendanceAnalytics('monthly')
  
  return {
    today: {
      totalStaff: mockUsers.length,
      present,
      late,
      veryLate,
      absent,
      attendanceRate: Math.round(((present + late + veryLate) / mockUsers.length) * 100)
    },
    thisWeek: weeklyData[weeklyData.length - 1] || {},
    thisMonth: monthlyData[monthlyData.length - 1] || {},
    leaves: {
      pending: pendingLeaves.length,
      approved: approvedLeaves.length,
      total: mockLeaveRequests.length
    },
    stations: mockStations.length,
    trends: {
      weeklyChange: weeklyData.length >= 2 ? 
        weeklyData[weeklyData.length - 1].attendanceRate - weeklyData[weeklyData.length - 2].attendanceRate : 0,
      monthlyChange: monthlyData.length >= 2 ?
        monthlyData[monthlyData.length - 1].attendanceRate - monthlyData[monthlyData.length - 2].attendanceRate : 0
    }
  }
}
