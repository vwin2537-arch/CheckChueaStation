import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { processedBy, action, rejectionReason } = body // action: 'approve' | 'reject'
    
    if (!processedBy || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: processedBy, action' },
        { status: 400 }
      )
    }
    
    // Verify processor exists and is admin
    const processor = await prisma.user.findUnique({
      where: { id: processedBy, role: 'ADMIN', isActive: true }
    })
    
    if (!processor) {
      return NextResponse.json(
        { success: false, error: 'Invalid processor or insufficient permissions' },
        { status: 403 }
      )
    }
    
    // Find leave request
    const leaveRequest = await prisma.leaveRequest.findUnique({
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
    
    if (!leaveRequest) {
      return NextResponse.json(
        { success: false, error: 'Leave request not found' },
        { status: 404 }
      )
    }
    
    if (leaveRequest.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Leave request already processed' },
        { status: 409 }
      )
    }
    
    // Update leave request
    const updateData: any = {
      processedBy,
      processedAt: new Date(),
      status: action === 'approve' ? 'APPROVED' : 'REJECTED',
    }
    
    if (action === 'reject' && rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }
    
    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id: params.id },
      data: updateData,
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
        userId: processedBy,
        action: action.toUpperCase(),
        resource: 'leave_request',
        resourceId: params.id,
        oldData: {
          status: 'PENDING',
        },
        newData: {
          status: updatedLeaveRequest.status,
          rejectionReason: updatedLeaveRequest.rejectionReason,
        },
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedLeaveRequest,
      message: `Leave request ${action}d successfully`
    })
  } catch (error) {
    console.error('Leave request approve error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process leave request' },
      { status: 500 }
    )
  }
}
