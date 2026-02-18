"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react"

interface Alert {
  id: string
  type: "gps_mismatch" | "device_mismatch" | "late" | "suspicious"
  staffName: string
  description: string
  time: string
  resolved: boolean
}

interface AlertsPanelProps {
  alerts: Alert[]
  className?: string
}

const alertStyles = {
  gps_mismatch: { icon: MapPin, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/20" },
  device_mismatch: { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/20" },
  late: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/20" },
  suspicious: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/20" },
}

const alertLabels = {
  gps_mismatch: "GPS ไม่ตรงจุด",
  device_mismatch: "อุปกรณ์ไม่ตรง",
  late: "เช็คชื่อสาย",
  suspicious: "พฤติกรรมผิดปกติ",
}

export function AlertsPanel({ alerts, className }: AlertsPanelProps) {
  const unresolvedAlerts = alerts.filter((a) => !a.resolved)

  return (
    <div className={cn("space-y-3", className)}>
      {unresolvedAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
          <p className="text-sm text-muted-foreground">ไม่มีการแจ้งเตือน</p>
        </div>
      ) : (
        unresolvedAlerts.map((alert) => {
          const style = alertStyles[alert.type]
          const Icon = style.icon

          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border",
                style.bg
              )}
            >
              <div className={cn("mt-0.5", style.color)}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{alert.staffName}</span>
                  <Badge variant="outline" className="text-xs">
                    {alertLabels[alert.type]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.time}
                </p>
              </div>

              <Button variant="outline" size="sm" className="shrink-0">
                ตรวจสอบ
              </Button>
            </div>
          )
        })
      )}
    </div>
  )
}
