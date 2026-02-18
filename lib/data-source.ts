// Data source configuration - Switch between mock and real database
import { mockUsers, mockStations, mockAttendance, mockLeaveRequests } from './database-mock'

// Environment variable to control data source
const USE_REAL_DATABASE = process.env.USE_REAL_DATABASE === 'true' && 
                         process.env.DATABASE_URL !== undefined && 
                         process.env.DATABASE_URL !== ''

// Types for API responses
interface ApiResponse<T> {
  success: boolean
  data: T
  total?: number
  message?: string
}

// Mock data fetchers (fallback)
const mockData = {
  users: async () => mockUsers,
  stations: async () => mockStations,
  attendance: async () => mockAttendance,
  leaveRequests: async () => mockLeaveRequests,
}

// Real database fetchers
const realData = {
  users: async () => {
    const response = await fetch('/api/users')
    const result: ApiResponse<any[]> = await response.json()
    return result.success ? result.data : mockUsers
  },
  stations: async () => {
    const response = await fetch('/api/stations')
    const result: ApiResponse<any[]> = await response.json()
    return result.success ? result.data : mockStations
  },
  attendance: async () => {
    const response = await fetch('/api/attendance')
    const result: ApiResponse<any[]> = await response.json()
    return result.success ? result.data : mockAttendance
  },
  leaveRequests: async () => {
    const response = await fetch('/api/leave-requests')
    const result: ApiResponse<any[]> = await response.json()
    return result.success ? result.data : mockLeaveRequests
  },
}

// Unified data access layer
export const dataSource = {
  // Get users from appropriate source
  getUsers: async () => {
    try {
      if (USE_REAL_DATABASE) {
        return await realData.users()
      }
      return await mockData.users()
    } catch (error) {
      console.warn('Failed to fetch real data, falling back to mock:', error)
      return await mockData.users()
    }
  },

  // Get stations from appropriate source
  getStations: async () => {
    try {
      if (USE_REAL_DATABASE) {
        return await realData.stations()
      }
      return await mockData.stations()
    } catch (error) {
      console.warn('Failed to fetch real data, falling back to mock:', error)
      return await mockData.stations()
    }
  },

  // Get attendance from appropriate source
  getAttendance: async (params?: { userId?: string; date?: string; limit?: number }) => {
    try {
      if (USE_REAL_DATABASE) {
        const searchParams = new URLSearchParams()
        if (params?.userId) searchParams.append('userId', params.userId)
        if (params?.date) searchParams.append('date', params.date)
        if (params?.limit) searchParams.append('limit', params.limit.toString())
        
        const response = await fetch(`/api/attendance?${searchParams}`)
        const result: ApiResponse<any[]> = await response.json()
        return result.success ? result.data : mockAttendance
      }
      return await mockData.attendance()
    } catch (error) {
      console.warn('Failed to fetch real data, falling back to mock:', error)
      return await mockData.attendance()
    }
  },

  // Get leave requests from appropriate source
  getLeaveRequests: async (params?: { userId?: string; status?: string }) => {
    try {
      if (USE_REAL_DATABASE) {
        const searchParams = new URLSearchParams()
        if (params?.userId) searchParams.append('userId', params.userId)
        if (params?.status) searchParams.append('status', params.status)
        
        const response = await fetch(`/api/leave-requests?${searchParams}`)
        const result: ApiResponse<any[]> = await response.json()
        return result.success ? result.data : mockLeaveRequests
      }
      return await mockData.leaveRequests()
    } catch (error) {
      console.warn('Failed to fetch real data, falling back to mock:', error)
      return await mockData.leaveRequests()
    }
  },

  // Check if using real database
  isUsingRealDatabase: () => USE_REAL_DATABASE,

  // Get data source status
  getStatus: () => ({
    usingRealDatabase: USE_REAL_DATABASE,
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'not configured',
  })
}

// Export for easy access
export const { getUsers, getStations, getAttendance, getLeaveRequests, isUsingRealDatabase, getStatus } = dataSource
