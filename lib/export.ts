import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Excel Export
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1') {
  try {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, `${filename}.xlsx`)
    return true
  } catch (error) {
    console.error('Excel export error:', error)
    return false
  }
}

// PDF Export from HTML element
export async function exportToPDF(elementId: string, filename: string) {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${filename}.pdf`)
    return true
  } catch (error) {
    console.error('PDF export error:', error)
    return false
  }
}

// PDF Export from data (table format)
export function exportDataToPDF(data: any[], filename: string, title: string = 'Report') {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Add title
    pdf.setFontSize(16)
    pdf.text(title, 105, 20, { align: 'center' })
    
    // Add timestamp
    pdf.setFontSize(10)
    pdf.text(`Generated: ${new Date().toLocaleString('th-TH')}`, 105, 30, { align: 'center' })
    
    // Prepare table data
    if (data.length === 0) {
      pdf.setFontSize(12)
      pdf.text('No data available', 105, 50, { align: 'center' })
    } else {
      const headers = Object.keys(data[0])
      const rows = data.map(item => headers.map(header => item[header] || ''))
      
      // Simple table rendering
      let yPosition = 50
      const lineHeight = 8
      const cellWidth = 190 / headers.length
      
      // Headers
      pdf.setFontSize(10)
      headers.forEach((header, index) => {
        pdf.text(header, 10 + index * cellWidth, yPosition)
      })
      yPosition += lineHeight
      
      // Data rows
      pdf.setFontSize(9)
      rows.forEach(row => {
        if (yPosition > 270) {
          pdf.addPage()
          yPosition = 20
        }
        
        row.forEach((cell, index) => {
          const text = String(cell).substring(0, 20) // Limit text length
          pdf.text(text, 10 + index * cellWidth, yPosition)
        })
        yPosition += lineHeight
      })
    }
    
    pdf.save(`${filename}.pdf`)
    return true
  } catch (error) {
    console.error('PDF export error:', error)
    return false
  }
}

// CSV Export
export function exportToCSV(data: any[], filename: string) {
  try {
    const headers = Object.keys(data[0])
    const csvHeaders = headers.join(',')
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
    
    const csvContent = [csvHeaders, ...csvRows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return true
    }
    
    return false
  } catch (error) {
    console.error('CSV export error:', error)
    return false
  }
}

// Format data for export
export function formatAttendanceForExport(attendance: any[], users: any[], stations: any[]) {
  return attendance.map(record => {
    const user = users.find(u => u.id === record.userId)
    const station = stations.find(s => s.id === record.stationId)
    
    return {
      'ชื่อ-นามสกุล': user?.name || 'Unknown',
      'อีเมล': user?.email || 'Unknown',
      'สถานี': station?.name || 'Unknown',
      'วันที่เช็คอิน': new Date(record.checkInAt).toLocaleString('th-TH'),
      'วันที่เช็คเอาท์': record.checkOutAt ? new Date(record.checkOutAt).toLocaleString('th-TH') : '-',
      'สถานะ': getStatusText(record.status),
      'หมายเหตุ': record.notes || '-',
    }
  })
}

export function formatLeaveRequestsForExport(requests: any[], users: any[]) {
  return requests.map(request => {
    const user = users.find(u => u.id === request.userId)
    
    return {
      'ชื่อ-นามสกุล': user?.name || 'Unknown',
      'อีเมล': user?.email || 'Unknown',
      'ประเภทการลา': getLeaveTypeText(request.type),
      'วันที่เริ่ม': new Date(request.startDate).toLocaleDateString('th-TH'),
      'วันที่สิ้นสุด': new Date(request.endDate).toLocaleDateString('th-TH'),
      'จำนวนวัน': request.days,
      'เหตุผล': request.reason,
      'สถานะ': getLeaveStatusText(request.status),
      'วันที่ส่ง': new Date(request.createdAt).toLocaleDateString('th-TH'),
      'วันที่ดำเนินการ': request.processedAt ? new Date(request.processedAt).toLocaleDateString('th-TH') : '-',
    }
  })
}

export function formatUsersForExport(users: any[]) {
  return users.map(user => ({
    'ชื่อ-นามสกุล': user.name,
    'อีเมล': user.email,
    'บทบาท': user.role === 'ADMIN' ? 'แอดมิน' : 'เจ้าหน้าที่',
    'สถานะ': user.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน',
    'วันที่สร้าง': new Date(user.createdAt).toLocaleDateString('th-TH'),
  }))
}

// Helper functions
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'PRESENT': 'มาปกติ',
    'LATE': 'มาสาย',
    'VERY_LATE': 'มาสายมาก',
    'ABSENT': 'ขาด',
    'LEAVE': 'ลา',
  }
  return statusMap[status] || status
}

function getLeaveTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    'MONTHLY_QUOTA': 'หยุดประจำเดือน',
    'SICK_LEAVE': 'ลาป่วย',
    'PERSONAL_LEAVE': 'ลากิจส่วนตัว',
    'VACATION_LEAVE': 'ลาพักผ่อน',
    'MATERNITY_LEAVE': 'ลาคลอดเรียน',
  }
  return typeMap[type] || type
}

function getLeaveStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'PENDING': 'รออนุมัติ',
    'APPROVED': 'อนุมัติแล้ว',
    'REJECTED': 'ปฏิเสธิต',
  }
  return statusMap[status] || status
}
