import { Server, Socket } from 'socket.io'
import { NextRequest } from 'next/server'
import { mockUsers, mockAttendance, mockStations, mockLeaveRequests } from './database-mock'

// In-memory storage for demo (in production, use Redis or database)
const connectedUsers = new Map<string, Socket>()
const attendanceUpdates = new Map<string, any>()
const leaveUpdates = new Map<string, any>()

// Socket.IO server setup
export function initializeSocketIO(req: NextRequest) {
  if (!global.socketIO) {
    console.log('Initializing Socket.IO server...')
    
    const httpServer = require('http').createServer()
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? ['https://yourdomain.com'] 
          : ['http://localhost:3000'],
        methods: ['GET', 'POST']
      }
    })

    io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`)
      
      // Join user to their role-based room
      socket.on('join-room', (data: { userId: string, role: string }) => {
        socket.join(data.role)
        socket.join(data.userId)
        connectedUsers.set(data.userId, socket)
        
        // Send current data
        socket.emit('initial-data', {
          attendance: Array.from(attendanceUpdates.values()),
          leaveRequests: Array.from(leaveUpdates.values()),
        })
      })

      // Handle new attendance
      socket.on('attendance-checkin', (data) => {
        const attendance = {
          id: Date.now().toString(),
          ...data,
          timestamp: new Date(),
        }
        
        attendanceUpdates.set(attendance.id, attendance)
        
        // Broadcast to all admin users
        io.to('ADMIN').emit('attendance-update', attendance)
        io.to('STAFF').emit('attendance-update', attendance)
      })

      // Handle leave request updates
      socket.on('leave-request', (data) => {
        const leaveRequest = {
          id: Date.now().toString(),
          ...data,
          timestamp: new Date(),
        }
        
        leaveUpdates.set(leaveRequest.id, leaveRequest)
        
        // Broadcast to admin users for approval
        io.to('ADMIN').emit('leave-request-new', leaveRequest)
      })

      // Handle leave approval/rejection
      socket.on('leave-approval', (data) => {
        const leaveRequest = {
          ...data,
          processedAt: new Date(),
        }
        
        leaveUpdates.set(data.id, leaveRequest)
        
        // Notify the specific user
        const userSocket = connectedUsers.get(data.userId)
        if (userSocket) {
          userSocket.emit('leave-request-updated', leaveRequest)
        }
        
        // Broadcast to all users
        io.emit('leave-request-updated', leaveRequest)
      })

      // Handle real-time dashboard updates
      socket.on('request-dashboard-data', () => {
        const dashboardData = generateDashboardData()
        socket.emit('dashboard-update', dashboardData)
      })

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)
        // Remove from connected users
        for (const [userId, userSocket] of Array.from(connectedUsers.entries())) {
          if (userSocket.id === socket.id) {
            connectedUsers.delete(userId)
            break
          }
        }
      })
    })

    // Store server instance globally
    global.socketIO = io
    global.httpServer = httpServer
    
    // Start server
    httpServer.listen(3001, () => {
      console.log('Socket.IO server running on port 3001')
    })
  }

  return global.socketIO
}

// Generate dashboard data
function generateDashboardData() {
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
  
  return {
    stats: {
      totalStaff: mockUsers.length,
      present: presentCount,
      late: lateCount,
      veryLate: veryLateCount,
      absent: absentCount,
      pendingLeaves: pendingLeaveRequests.length,
    },
    recentAttendance: todayAttendance.slice(-5).reverse(),
    recentLeaveRequests: pendingLeaveRequests.slice(-5).reverse(),
    timestamp: new Date(),
  }
}

// Client-side Socket.IO hook
export function useSocketIO() {
  if (typeof window === 'undefined') return null

  const socket = require('socket.io-client').io('http://localhost:3001', {
    transports: ['websocket'],
  })

  return socket
}

// Mock real-time data generator (for demo)
export function startMockRealTimeUpdates() {
  // Simulate random check-ins
  setInterval(() => {
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    const randomStation = mockStations[Math.floor(Math.random() * mockStations.length)]
    
    const attendance = {
      id: Date.now().toString(),
      userId: randomUser.id,
      stationId: randomStation.id,
      checkInAt: new Date(),
      status: Math.random() > 0.7 ? 'LATE' : 'ON_TIME',
      notes: null,
    }
    
    attendanceUpdates.set(attendance.id, attendance)
    
    // Emit to connected clients
    if (global.socketIO) {
      global.socketIO.to('ADMIN').emit('attendance-update', attendance)
      global.socketIO.to('STAFF').emit('attendance-update', attendance)
    }
  }, 30000) // Every 30 seconds

  // Simulate dashboard data updates
  setInterval(() => {
    if (global.socketIO) {
      const dashboardData = generateDashboardData()
      global.socketIO.emit('dashboard-update', dashboardData)
    }
  }, 10000) // Every 10 seconds
}

// Global declarations
declare global {
  var socketIO: Server | undefined
  var httpServer: any
}
