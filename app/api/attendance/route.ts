import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const stationId = searchParams.get('stationId')
    const date = searchParams.get('date')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const where: any = {}
    
    if (userId) where.userId = userId
    if (stationId) where.stationId = stationId
    if (status) where.status = status.toUpperCase()
    
    // Date filtering
    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)
      
      where.checkInAt = {
        gte: startOfDay,
        lte: endOfDay
      }
    }
    
    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        station: {
          select: {
            id: true,
            name: true,
            location: true,
          }
        }
      },
      orderBy: {
        checkInAt: 'desc'
      },
      take: limit,
      skip: offset,
    })
    
    const total = await prisma.attendance.count({ where })
    
    return NextResponse.json({
      success: true,
      data: attendance,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Attendance GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, stationId, checkInTime, notes } = body
    
    if (!userId || !stationId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, stationId' },
        { status: 400 }
      )
    }
    
    // Verify user and station exist
    const [user, station] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId, isActive: true } }),
      prisma.station.findUnique({ where: { id: stationId, isActive: true } })
    ])
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found or inactive' },
        { status: 404 }
      )
    }
    
    if (!station) {
      return NextResponse.json(
        { success: false, error: 'Station not found or inactive' },
        { status: 404 }
      )
    }
    
    // Check if already checked in today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        checkInAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })
    
    if (existingAttendance) {
      return NextResponse.json(
        { success: false, error: 'Already checked in today' },
        { status: 409 }
      )
    }
    
    // Determine check-in time and status
    const checkInAt = checkInTime ? new Date(checkInTime) : new Date()
    const checkInHour = checkInAt.getHours()
    const checkInMinute = checkInAt.getMinutes()
    const totalMinutes = checkInHour * 60 + checkInMinute
    
    let status: 'PRESENT' | 'LATE' | 'VERY_LATE'
    
    if (totalMinutes <= 8 * 60 + 15) { // Before 8:15
      status = 'PRESENT'
    } else if (totalMinutes <= 8 * 60 + 45) { // Before 8:45
      status = 'LATE'
    } else {
      status = 'VERY_LATE'
    }
    
    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        stationId,
        checkInAt,
        status,
        notes: notes || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        station: {
          select: {
            id: true,
            name: true,
            location: true,
          }
        }
      }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CHECK_IN',
        resource: 'attendance',
        resourceId: attendance.id,
        newData: {
          stationId,
          checkInAt: attendance.checkInAt,
          status,
        },
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })
    
    return NextResponse.json({
      success: true,
      data: attendance,
      message: `Check-in successful. Status: ${status}`
    })
  } catch (error) {
    console.error('Attendance POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check in' },
      { status: 500 }
    )
  }
}
