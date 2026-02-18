import { NextResponse } from 'next/server'
import { mockUsers, mockStations, mockAttendance, mockLeaveRequests } from '@/lib/database-mock'

export async function GET() {
  try {
    // Always use mock data for now (until PostgreSQL is set up)
    return NextResponse.json({
      message: 'Using mock data (development mode)',
      database: 'mock',
      timestamp: new Date().toISOString(),
      data: {
        users: mockUsers.length,
        stations: mockStations.length,
        attendance: mockAttendance.length,
        leaveRequests: mockLeaveRequests.length,
      },
      mockData: {
        users: mockUsers,
        stations: mockStations,
        attendance: mockAttendance,
        leaveRequests: mockLeaveRequests,
      },
      setupInstructions: {
        postgresql: "Install PostgreSQL and update .env.local with DATABASE_URL",
        docker: "Run: docker run --name postgres-attendance -e POSTGRES_PASSWORD=password -e POSTGRES_DB=attendance_db -p 5432:5432 -d postgres",
        migrate: "Run: npx prisma db push && npx prisma db seed"
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    
    return NextResponse.json({
      message: 'Error loading mock data',
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
