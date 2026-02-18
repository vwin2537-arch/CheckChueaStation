import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const createdBy = searchParams.get('createdBy')
    
    const where: any = {}
    if (isActive !== null) where.isActive = isActive === 'true'
    if (createdBy) where.createdBy = createdBy
    
    const stations = await prisma.station.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        _count: {
          select: {
            attendance: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: stations,
      total: stations.length
    })
  } catch (error) {
    console.error('Stations GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, location, description, createdBy, qrCode } = body
    
    if (!name || !location || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, location, createdBy' },
        { status: 400 }
      )
    }
    
    // Verify creator exists and is admin
    const creator = await prisma.user.findUnique({
      where: { id: createdBy, role: 'ADMIN', isActive: true }
    })
    
    if (!creator) {
      return NextResponse.json(
        { success: false, error: 'Invalid creator or insufficient permissions' },
        { status: 403 }
      )
    }
    
    // Generate QR code if not provided
    const stationQrCode = qrCode || `https://checkchuea.local/scan?station=${Date.now()}`
    
    // Create station
    const station = await prisma.station.create({
      data: {
        name,
        location,
        description: description || null,
        qrCode: stationQrCode,
        isActive: true,
        createdBy,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        _count: {
          select: {
            attendance: true,
          }
        }
      }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: createdBy,
        action: 'CREATE',
        resource: 'station',
        resourceId: station.id,
        newData: { name, location, description, qrCode: stationQrCode },
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })
    
    return NextResponse.json({
      success: true,
      data: station,
      message: 'Station created successfully'
    })
  } catch (error) {
    console.error('Stations POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create station' },
      { status: 500 }
    )
  }
}
