"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

interface Activity {
  id: string
  staffName: string
  staffAvatar?: string
  action: "check_in" | "check_out" | "leave" | "alert"
  station?: string
  time: string
  status?: "on_time" | "late" | "very_late"
}

interface RecentActivityProps {
  activities: Activity[]
  className?: string
}

const actionLabels = {
  check_in: "เช็คชื่อเข้า",
  check_out: "เช็คชื่อออก",
  leave: "แจ้งลา",
  alert: "แจ้งเตือน",
}

const statusStyles = {
  on_time: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  late: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  very_late: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels = {
  on_time: "ตรงเวลา",
  late: "สาย",
  very_late: "สายมาก",
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={activity.staffAvatar} alt={activity.staffName} />
            <AvatarFallback>
              {activity.staffName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{activity.staffName}</span>
              <Badge variant="secondary" className="text-xs">
                {actionLabels[activity.action]}
              </Badge>
              {activity.status && (
                <Badge className={cn("text-xs", statusStyles[activity.status])}>
                  {statusLabels[activity.status]}
                </Badge>
              )}
            </div>

            {activity.station && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                <span>{activity.station}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              <span>{activity.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
