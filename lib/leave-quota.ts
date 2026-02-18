export function getMonthlyLeaveQuota(year: number, month: number): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return daysInMonth >= 30 ? 5 : 4
}

export function getLeaveQuotaDescription(year: number, month: number): string {
  const quota = getMonthlyLeaveQuota(year, month)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return `${daysInMonth} วัน = หยุดได้ ${quota} วัน`
}

export function validateLeaveDates(
  startDate: Date,
  endDate: Date,
  year: number,
  month: number,
  existingLeaves: { startDate: Date; endDate: Date }[] = []
): { valid: boolean; error?: string } {
  // Check if start date is after end date
  if (startDate > endDate) {
    return { valid: false, error: "วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด" }
  }

  // Check if dates are in the past
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (startDate < today) {
    return { valid: false, error: "ไม่สามารถลาย้อนหลังได้" }
  }

  // Check if dates are in the correct month/year
  if (startDate.getFullYear() !== year || startDate.getMonth() !== month) {
    return { valid: false, error: "วันที่ต้องอยู่ในเดือนที่เลือก" }
  }
  if (endDate.getFullYear() !== year || endDate.getMonth() !== month) {
    return { valid: false, error: "วันที่ต้องอยู่ในเดือนที่เลือก" }
  }

  // Check for overlapping existing leaves
  for (const existing of existingLeaves) {
    if (
      (startDate >= existing.startDate && startDate <= existing.endDate) ||
      (endDate >= existing.startDate && endDate <= existing.endDate) ||
      (startDate <= existing.startDate && endDate >= existing.endDate)
    ) {
      return { valid: false, error: "มีการลาในช่วงวันที่เลือกแล้ว" }
    }
  }

  // Check weekend dates (Saturday=6, Sunday=0)
  const weekendDays: Date[] = []
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) {
      weekendDays.push(new Date(d))
    }
  }

  if (weekendDays.length > 0) {
    const weekendNames = weekendDays.map(d => d.toLocaleDateString('th-TH', { weekday: 'long' }))
    return { valid: false, error: `ไม่สามารถลาในวันหยุด: ${weekendNames.join(', ')}` }
  }

  return { valid: true }
}

export function calculateLeaveDays(startDate: Date, endDate: Date): number {
  let days = 0
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Skip weekends
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      days++
    }
  }
  return days
}
