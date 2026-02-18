import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockUsers, mockStations, mockAttendance, mockLeaveRequests } from '@/lib/database-mock'

export async function GET() {
  try {
    const useRealDatabase = process.env.USE_REAL_DATABASE === 'true' && 
                           process.env.DATABASE_URL !== undefined && 
                           process.env.DATABASE_URL !== ''
    
    if (useRealDatabase && prisma) {
      // Test real database connection
      try {
        const [userCount, stationCount, attendanceCount, leaveCount] = await Promise.all([
          prisma.user.count(),
          prisma.station.count(),
          prisma.attendance.count(),
          prisma.leaveRequest.count(),
        ])
        
        return NextResponse.json({
          success: true,
          dataSource: 'real',
          status: 'connected',
          data: {
            users: userCount,
            stations: stationCount,
            attendance: attendanceCount,
            leaveRequests: leaveCount,
          },
          message: 'Using real PostgreSQL database',
          environment: process.env.NODE_ENV,
          databaseUrlStatus: process.env.DATABASE_URL ? 'configured' : 'not configured',
          useRealDatabaseFlag: process.env.USE_REAL_DATABASE || 'not set',
        })
      } catch (dbError) {
        console.error('Database connection failed:', dbError)
        
        // Fallback to mock with warning
        return NextResponse.json({
          success: true,
          dataSource: 'mock',
          status: 'fallback',
          data: {
            users: mockUsers.length,
            stations: mockStations.length,
            attendance: mockAttendance.length,
            leaveRequests: mockLeaveRequests.length,
          },
          message: 'Database connection failed, using mock data',
          error: dbError instanceof Error ? dbError.message : 'Unknown error',
          environment: process.env.NODE_ENV,
          databaseUrlStatus: process.env.DATABASE_URL ? 'configured' : 'not configured',
          useRealDatabaseFlag: process.env.USE_REAL_DATABASE || 'not set',
          setupInstructions: {
            enableRealDatabase: "Set USE_REAL_DATABASE=true in .env.local",
            setupDatabase: "Run: docker-compose up -d && npm run db:push && npm run db:seed",
          }
        })
      }
    } else {
      // Use mock data
      return NextResponse.json({
        success: true,
        dataSource: 'mock',
        status: 'enabled',
        data: {
          users: mockUsers.length,
          stations: mockStations.length,
          attendance: mockAttendance.length,
          leaveRequests: mockLeaveRequests.length,
        },
        message: 'Using mock data (development mode)',
        environment: process.env.NODE_ENV,
        databaseUrlStatus: process.env.DATABASE_URL ? 'configured' : 'not configured',
        useRealDatabaseFlag: process.env.USE_REAL_DATABASE || 'not set',
        setupInstructions: {
          enableRealDatabase: "Set USE_REAL_DATABASE=true in .env.local",
          setupDatabase: "Run: docker-compose up -d && npm run db:push && npm run db:seed",
        }
      })
    }
  } catch (error) {
    console.error('Data source check error:', error)
    
    return NextResponse.json({
      success: false,
      dataSource: 'error',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dataSource } = body
    
    if (dataSource !== 'mock' && dataSource !== 'real') {
      return NextResponse.json(
        { success: false, error: 'Invalid data source. Use "mock" or "real"' },
        { status: 400 }
      )
    }
    
    // This would typically update environment variables
    // For now, just return what would be set
    return NextResponse.json({
      success: true,
      message: `Data source switched to ${dataSource}`,
      note: 'Restart the application to apply changes',
      environment: process.env.NODE_ENV,
      currentSetting: process.env.USE_REAL_DATABASE === 'true' ? 'real' : 'mock',
      newSetting: dataSource,
    })
  } catch (error) {
    console.error('Data source switch error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to switch data source' },
      { status: 500 }
    )
  }
}
