// Mock database for development without PostgreSQL
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

// Mock API functions
export const mockDb = {
  users: {
    findMany: async () => mockUsers,
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email) return mockUsers.find(u => u.email === where.email)
      if (where.id) return mockUsers.find(u => u.id === where.id)
      return null
    },
    create: async (data: any) => ({ id: Math.random().toString(), ...data.data }),
    update: async ({ where, data }: any) => {
      const user = mockUsers.find(u => u.id === where.id)
      return { ...user, ...data }
    },
    delete: async ({ where }: any) => mockUsers.find(u => u.id === where.id),
  },
  stations: {
    findMany: async () => mockStations,
    findUnique: async ({ where }: { where: { id?: string } }) => {
      if (where.id) return mockStations.find(s => s.id === where.id)
      return null
    },
    create: async (data: any) => ({ id: Math.random().toString(), ...data.data }),
  },
  attendance: {
    findMany: async () => mockAttendance,
    create: async (data: any) => ({ id: Math.random().toString(), ...data.data }),
  },
  leaveRequests: {
    findMany: async () => mockLeaveRequests,
    findUnique: async ({ where }: { where: { id?: string } }) => {
      if (where.id) return mockLeaveRequests.find(l => l.id === where.id)
      return null
    },
    create: async (data: any) => ({ id: Math.random().toString(), ...data.data }),
    update: async ({ where, data }: any) => {
      const request = mockLeaveRequests.find(l => l.id === where.id)
      return { ...request, ...data }
    },
  },
}
