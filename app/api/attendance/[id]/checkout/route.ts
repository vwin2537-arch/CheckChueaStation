import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { checkOutTime, notes } = body
    
    // Find attendance record
    const attendance = await prisma.attendance.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })
    
    if (!attendance) {
      return NextResponse.json(
        { success: false, error: 'Attendance record not found' },
        { status: 404 }
      )
    }
    
    if (attendance.checkOutAt) {
      return NextResponse.json(
        { success: false, error: 'Already checked out' },
        { status: 409 }
      )
    }
    
    // Set check-out time
    const checkOutAt = checkOutTime ? new Date(checkOutTime) : new Date()
    
    // Update attendance record
    const updatedAttendance = await prisma.attendance.update({
      where: { id: params.id },
      data: {
        checkOutAt,
        notes: notes || attendance.notes,
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
        userId: attendance.userId,
        action: 'CHECK_OUT',
        resource: 'attendance',
        resourceId: params.id,
        newData: {
          checkOutAt: updatedAttendance.checkOutAt,
          notes: updatedAttendance.notes,
        },
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedAttendance,
      message: 'Check-out successful'
    })
  } catch (error) {
    console.error('Check-out POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check out' },
      { status: 500 }
    )
  }
}
