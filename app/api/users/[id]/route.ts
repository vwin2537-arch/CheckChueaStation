import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            attendance: true,
            leaveRequests: true,
            createdStations: true,
          }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('User GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { email, name, role, password, isActive } = body
    
    // Get current user for audit
    const currentUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { email: true, name: true, role: true, isActive: true }
    })
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const updateData: any = {}
    if (email !== undefined) updateData.email = email
    if (name !== undefined) updateData.name = name
    if (role !== undefined) updateData.role = role.toUpperCase()
    if (isActive !== undefined) updateData.isActive = isActive
    if (password !== undefined) updateData.password = await bcrypt.hash(password, 10)
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'user',
        resourceId: params.id,
        oldData: currentUser,
        newData: updateData,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error('User PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user for audit
    const currentUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { email: true, name: true, role: true, isActive: true }
    })
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Soft delete (deactivate)
    await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        resource: 'user',
        resourceId: params.id,
        oldData: currentUser,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully'
    })
  } catch (error) {
    console.error('User DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to deactivate user' },
      { status: 500 }
    )
  }
}
