import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    if (!prisma) {
      // Return mock data fallback
      const { mockUsers } = await import('@/lib/database-mock')
      return NextResponse.json({
        success: true,
        data: mockUsers,
        total: mockUsers.length,
        source: 'mock'
      })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const isActive = searchParams.get('isActive')
    
    const where: any = {}
    if (role) where.role = role.toUpperCase()
    if (isActive !== null) where.isActive = isActive === 'true'
    
    const users = await prisma.user.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: users,
      total: users.length,
      source: 'database'
    })
  } catch (error) {
    console.error('Users GET error:', error)
    
    // Fallback to mock data on error
    try {
      const { mockUsers } = await import('@/lib/database-mock')
      return NextResponse.json({
        success: true,
        data: mockUsers,
        total: mockUsers.length,
        source: 'mock-fallback',
        error: 'Database unavailable, using mock data'
      })
    } catch (mockError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users and mock data unavailable' },
        { status: 500 }
      )
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, role, password } = body
    
    if (!email || !name || !role || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role.toUpperCase(),
        password: hashedPassword,
        isActive: true,
      },
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
        action: 'CREATE',
        resource: 'user',
        resourceId: user.id,
        newData: { email, name, role },
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('Users POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
