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
  LogOut,
  ChevronLeft,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  role?: "admin" | "staff"
  collapsed?: boolean
  onToggle?: () => void
}

const adminNavItems = [
  { title: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard },
  { title: "เจ้าหน้าที่", href: "/dashboard/staff", icon: Users },
  { title: "จุดสแกน", href: "/dashboard/stations", icon: MapPin },
  { title: "รายงาน", href: "/dashboard/reports", icon: FileText },
  { title: "แจ้งเตือน", href: "/dashboard/alerts", icon: Bell },
  { title: "ตั้งค่า", href: "/dashboard/settings", icon: Settings },
]

const staffNavItems = [
  { title: "หน้าหลัก", href: "/dashboard", icon: LayoutDashboard },
  { title: "เช็คชื่อ", href: "/dashboard/scan", icon: MapPin },
  { title: "ประวัติ", href: "/dashboard/history", icon: Calendar },
  { title: "แจ้งลา", href: "/dashboard/leave", icon: FileText },
  { title: "โปรไฟล์", href: "/dashboard/profile", icon: Settings },
]

export function Sidebar({ role = "staff", collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const navItems = role === "admin" ? adminNavItems : staffNavItems

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
            <Flame className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">ควบคุมไฟป่า</span>
              <span className="text-xs text-muted-foreground">Attendance System</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
          <Avatar className="w-9 h-9">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">สมชาย ใจดี</p>
              <p className="text-xs text-muted-foreground truncate">
                {role === "admin" ? "หัวหน้าสถานี" : "เจ้าหน้าที่"}
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button variant="ghost" size="sm" className="w-full mt-3 justify-start text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            ออกจากระบบ
          </Button>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute top-5 -right-3 w-6 h-6 rounded-full border bg-background shadow-sm hidden lg:flex"
      >
        <ChevronLeft
          className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")}
        />
      </Button>
    </div>
  )
}
