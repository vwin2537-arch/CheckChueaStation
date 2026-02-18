import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data (for development)
  if (process.env.NODE_ENV === 'development') {
    await prisma.auditLog.deleteMany()
    await prisma.leaveRequest.deleteMany()
    await prisma.attendance.deleteMany()
    await prisma.station.deleteMany()
    await prisma.user.deleteMany()
    console.log('🧹 Cleaned existing data')
  }

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@checkchuea.local',
      name: 'สมศักดิ์ ขยัน',
      role: 'ADMIN',
      password: await bcrypt.hash('admin123', 10),
      isActive: true,
    },
  })

  const staffUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'staff1@checkchuea.local',
        name: 'สมชาย ใจดี',
        role: 'STAFF',
        password: await bcrypt.hash('staff123', 10),
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'staff2@checkchuea.local',
        name: 'สมหญิง มั่นคง',
        role: 'STAFF',
        password: await bcrypt.hash('staff123', 10),
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'staff3@checkchuea.local',
        name: 'วิชัย รักงาน',
        role: 'STAFF',
        password: await bcrypt.hash('staff123', 10),
        isActive: true,
      },
    }),
  ])

  console.log('👥 Created users:', { admin: adminUser.name, staff: staffUsers.length })

  // Create stations
  const stations = await Promise.all([
    prisma.station.create({
      data: {
        name: 'สถานีที่ 1 - อาคารหลัก',
        location: 'ชั้น 1 ด้านหน้า',
        description: 'จุดเช็คชื่อหลักของอาคาร',
        qrCode: 'https://checkchuea.local/scan?station=1',
        isActive: true,
        createdBy: adminUser.id,
      },
    }),
    prisma.station.create({
      data: {
        name: 'สถานีที่ 2 - โรงจอดรถ',
        location: 'ชั้น B1 โรงจอดรถ',
        description: 'จุดเช็คชื่อโรงจอดรถ',
        qrCode: 'https://checkchuea.local/scan?station=2',
        isActive: true,
        createdBy: adminUser.id,
      },
    }),
  ])

  console.log('📍 Created stations:', stations.map(s => s.name))

  // Create attendance records (last 30 days)
  const attendanceRecords = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    for (const user of staffUsers) {
      // Random check-in time between 7:30 and 9:30
      const checkInHour = 7 + Math.floor(Math.random() * 2)
      const checkInMinute = 30 + Math.floor(Math.random() * 60)
      
      const checkInAt = new Date(date)
      checkInAt.setHours(checkInHour, checkInMinute, 0, 0)
      
      // Random status
      const rand = Math.random()
      let status: 'PRESENT' | 'LATE' | 'VERY_LATE' | 'ABSENT'
      
      if (rand < 0.7) status = 'PRESENT'
      else if (rand < 0.85) status = 'LATE'
      else if (rand < 0.95) status = 'VERY_LATE'
      else status = 'ABSENT'
      
      if (status !== 'ABSENT') {
        const station = stations[Math.floor(Math.random() * stations.length)]
        
        attendanceRecords.push({
          userId: user.id,
          stationId: station.id,
          checkInAt,
          status,
          notes: status !== 'PRESENT' ? `เข้างาน${status === 'LATE' ? 'สาย' : 'สายมาก'}` : null,
        })
      }
    }
  }
  
  await prisma.attendance.createMany({
    data: attendanceRecords,
  })
  
  console.log(`⏰ Created ${attendanceRecords.length} attendance records`)

  // Create leave requests
  const leaveRequests = [
    {
      userId: staffUsers[0].id,
      type: 'SICK_LEAVE' as const,
      startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      days: 2,
      reason: 'ป่วดไข้ มีไข้',
      status: 'PENDING' as const,
    },
    {
      userId: staffUsers[1].id,
      type: 'PERSONAL_LEAVE' as const,
      startDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      endDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      days: 1,
      reason: 'ติดธุระส่วนตัว',
      status: 'APPROVED' as const,
      processedBy: adminUser.id,
      processedAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      userId: staffUsers[2].id,
      type: 'MONTHLY_QUOTA' as const,
      startDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      endDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      days: 1,
      reason: 'หยุดประจำเดือน',
      status: 'APPROVED' as const,
      processedBy: adminUser.id,
      processedAt: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000),
    },
  ]
  
  for (const leaveRequest of leaveRequests) {
    await prisma.leaveRequest.create({ data: leaveRequest })
  }
  
  console.log(`📝 Created ${leaveRequests.length} leave requests`)

  // Create audit logs
  const auditLogs = [
    {
      userId: adminUser.id,
      action: 'CREATE',
      resource: 'station',
      resourceId: stations[0].id,
      newData: { name: stations[0].name },
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (System)',
    },
    {
      userId: adminUser.id,
      action: 'APPROVE',
      resource: 'leave_request',
      resourceId: leaveRequests[1].userId,
      newData: { status: 'APPROVED' },
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (System)',
    },
  ]
  
  await prisma.auditLog.createMany({
    data: auditLogs,
  })
  
  console.log(`📋 Created ${auditLogs.length} audit logs`)

  console.log('✅ Database seeding completed!')
  console.log('')
  console.log('🔑 Login credentials:')
  console.log('Admin: admin@checkchuea.local / admin123')
  console.log('Staff: staff1@checkchuea.local / staff123')
  console.log('       staff2@checkchuea.local / staff123')
  console.log('       staff3@checkchuea.local / staff123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
