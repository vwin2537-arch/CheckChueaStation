import { prisma } from './prisma'

// Database seed function
export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      console.log('Database already seeded')
      return
    }

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@checkchuea.local',
        name: 'สมศักดิ์ ขยัน',
        role: 'ADMIN',
        password: 'demo-admin-password', // In production, this should be hashed
      },
    })

    // Create staff users
    const staff1 = await prisma.user.create({
      data: {
        email: 'somchai@checkchuea.local',
        name: 'สมชาย ใจดี',
        role: 'STAFF',
        password: 'demo-staff-password',
      },
    })

    const staff2 = await prisma.user.create({
      data: {
        email: 'somying@checkchuea.local',
        name: 'สมหญิง รักงาน',
        role: 'STAFF',
        password: 'demo-staff-password',
      },
    })

    // Create stations
    const station1 = await prisma.station.create({
      data: {
        name: 'สถานีหลัก',
        location: 'ชั้น 1 อาคาร A',
        description: 'จุดเช็คชื่อหลัก',
        qrCode: 'station-main-001',
        createdBy: admin.id,
      },
    })

    const station2 = await prisma.station.create({
      data: {
        name: 'สถานีที่ 2',
        location: 'ชั้น 2 อาคาร B',
        description: 'จุดเช็คชื่อรอง',
        qrCode: 'station-secondary-002',
        createdBy: admin.id,
      },
    })

    // Create sample attendance records
    const today = new Date()
    today.setHours(8, 30, 0, 0) // 8:30 AM

    await prisma.attendance.createMany({
      data: [
        {
          userId: staff1.id,
          stationId: station1.id,
          checkInAt: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 6:30 AM
          status: 'VERY_LATE',
        },
        {
          userId: staff2.id,
          stationId: station1.id,
          checkInAt: new Date(today.getTime() - 30 * 60 * 1000), // 8:00 AM
          status: 'ON_TIME',
        },
      ],
    })

    // Create sample leave requests
    await prisma.leaveRequest.createMany({
      data: [
        {
          userId: staff1.id,
          type: 'SICK_LEAVE',
          startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          days: 2,
          reason: 'ป่วดไข้ มีไข้',
          status: 'PENDING',
        },
        {
          userId: staff2.id,
          type: 'PERSONAL_LEAVE',
          startDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          endDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          days: 1,
          reason: 'ติดธุระส่วนตัว',
          status: 'APPROVED',
          processedBy: admin.id,
          processedAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
        },
      ],
    })

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// Test database connection
export async function testConnection() {
  try {
    await prisma.$connect()
    console.log('Database connected successfully!')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Mock data for development without database
export const mockUsers = [
  {
    id: '1',
    email: 'admin@checkchuea.local',
    name: 'สมศักดิ์ ขยัน',
    role: 'ADMIN' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'somchai@checkchuea.local',
    name: 'สมชาย ใจดี',
    role: 'STAFF' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'somying@checkchuea.local',
    name: 'สมหญิง รักงาน',
    role: 'STAFF' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const mockStations = [
  {
    id: '1',
    name: 'สถานีหลัก',
    location: 'ชั้น 1 อาคาร A',
    description: 'จุดเช็คชื่อหลัก',
    qrCode: 'station-main-001',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
  },
  {
    id: '2',
    name: 'สถานีที่ 2',
    location: 'ชั้น 2 อาคาร B',
    description: 'จุดเช็คชื่อรอง',
    qrCode: 'station-secondary-002',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
  },
]

export const mockAttendance = [
  {
    id: '1',
    userId: '2',
    stationId: '1',
    checkInAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    checkOutAt: null,
    status: 'VERY_LATE' as const,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '3',
    stationId: '1',
    checkInAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    checkOutAt: null,
    status: 'ON_TIME' as const,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const mockLeaveRequests = [
  {
    id: '1',
    userId: '2',
    type: 'SICK_LEAVE' as const,
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    days: 2,
    reason: 'ป่วดไข้ มีไข้',
    status: 'PENDING' as const,
    rejectionReason: null,
    processedBy: null,
    processedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '3',
    type: 'PERSONAL_LEAVE' as const,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    days: 1,
    reason: 'ติดธุระส่วนตัว',
    status: 'APPROVED' as const,
    rejectionReason: null,
    processedBy: '1',
    processedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
