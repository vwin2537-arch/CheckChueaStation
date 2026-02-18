import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const where: any = {}
    if (userId) where.userId = userId
    if (status) where.status = status.toUpperCase()
    if (type) where.type = type.toUpperCase()
    
    const leaveRequests = await prisma.leaveRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
    })
    
    const total = await prisma.leaveRequest.count({ where })
    
    return NextResponse.json({
      success: true,
      data: leaveRequests,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Leave requests GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leave requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, startDate, endDate, reason } = body
    
    if (!userId || !type || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: userId, isActive: true }
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found or inactive' },
        { status: 404 }
      )
    }
    
    // Calculate days (excluding weekends)
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start > end) {
      return NextResponse.json(
        { success: false, error: 'Start date must be before end date' },
        { status: 400 }
      )
    }
    
    let days = 0
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Saturday or Sunday
        days++
      }
    }
    
    // Check for overlapping leave requests
    const overlappingLeave = await prisma.leaveRequest.findFirst({
      where: {
        userId,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          {
            startDate: { lte: start },
            endDate: { gte: start }
          },
          {
            startDate: { lte: end },
            endDate: { gte: end }
          },
          {
            startDate: { gte: start },
            endDate: { lte: end }
          }
        ]
      }
    })
    
    if (overlappingLeave) {
      return NextResponse.json(
        { success: false, error: 'Overlapping leave request exists' },
        { status: 409 }
      )
    }
    
    // Create leave request
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId,
        type: type.toUpperCase(),
        startDate: start,
        endDate: end,
        days,
        reason,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CREATE',
        resource: 'leave_request',
        resourceId: leaveRequest.id,
        newData: {
          type: leaveRequest.type,
          startDate: leaveRequest.startDate,
          endDate: leaveRequest.endDate,
          days,
          reason,
        },
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })
    
    return NextResponse.json({
      success: true,
      data: leaveRequest,
      message: 'Leave request submitted successfully'
    })
  } catch (error) {
    console.error('Leave requests POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create leave request' },
      { status: 500 }
    )
  }
}
