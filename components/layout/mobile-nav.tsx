"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  MapPin,
  Calendar,
  FileText,
  Settings,
  Bell,
  X,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppSession } from "@/components/auth/session-provider"

interface MobileNavProps {
  open: boolean
  onClose: () => void
  role?: "admin" | "staff"
}

const adminNavItems = [
  { title: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard },
  { title: "Real-time", href: "/dashboard/realtime", icon: Calendar },
  { title: "เจ้าหน้าที่", href: "/dashboard/admin/staff", icon: Users },
  { title: "จุดสแกน", href: "/dashboard/admin/stations", icon: MapPin },
  { title: "อนุมัติลา", href: "/dashboard/admin/leave-approval", icon: Calendar },
]

const staffNavItems = [
  { title: "หน้าหลัก", href: "/dashboard/staff", icon: LayoutDashboard },
  { title: "เช็คชื่อ", href: "/dashboard/scan", icon: MapPin },
  { title: "ประวัติ", href: "/dashboard/history", icon: Calendar },
  { title: "แจ้งลา", href: "/dashboard/leave", icon: FileText },
  { title: "โปรไฟล์", href: "/dashboard/profile", icon: Settings },
]

export function MobileNav({ open, onClose, role = "staff" }: MobileNavProps) {
  const pathname = usePathname()
  const navItems = role === "admin" ? adminNavItems : staffNavItems
  const homeHref = role === "admin" ? "/dashboard" : "/dashboard/staff"
  const session = useAppSession()
  const fallbackInitials = session.displayName.trim().slice(0, 2) || "US"

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-[280px] bg-card shadow-xl lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href={homeHref} className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">ควบคุมไฟป่า</span>
              <span className="text-xs text-muted-foreground">Attendance System</span>
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback>{fallbackInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.displayName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {role === "admin" ? "หัวหน้าสถานี" : "เจ้าหน้าที่"}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full mt-3">
            <Link href="/auth/logout">ออกจากระบบ</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
