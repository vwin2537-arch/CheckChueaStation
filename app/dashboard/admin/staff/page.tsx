"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
} from "lucide-react"

// Mock staff data
const staffList = [
  {
    id: "1",
    name: "สมชาย ใจดี",
    position: "เจ้าหน้าที่ป้องกันไฟป่า",
    email: "somchai@example.com",
    phone: "081-234-5678",
    role: "staff" as const,
    status: "active" as const,
    station: "จุดสแกน A",
    avatar: "/avatar.png",
  },
  {
    id: "2",
    name: "สมหญิง รักงาน",
    position: "เจ้าหน้าที่ป้องกันไฟป่า",
    email: "somying@example.com",
    phone: "082-345-6789",
    role: "staff" as const,
    status: "active" as const,
    station: "จุดสแกน B",
    avatar: null,
  },
  {
    id: "3",
    name: "สมศักดิ์ ขยัน",
    position: "หัวหน้าสถานี",
    email: "somsak@example.com",
    phone: "083-456-7890",
    role: "admin" as const,
    status: "active" as const,
    station: "จุดสแกน A",
    avatar: null,
  },
  {
    id: "4",
    name: "สมศรี มาสาย",
    position: "เจ้าหน้าที่ป้องกันไฟป่า",
    email: "somsri@example.com",
    phone: "084-567-8901",
    role: "staff" as const,
    status: "pending" as const,
    station: "-",
    avatar: null,
  },
  {
    id: "5",
    name: "สมปอง ลางาน",
    position: "เจ้าหน้าที่ป้องกันไฟป่า",
    email: "sompong@example.com",
    phone: "085-678-9012",
    role: "staff" as const,
    status: "inactive" as const,
    station: "จุดสแกน C",
    avatar: null,
  },
]

const statusStyles = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  inactive: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
}

const statusLabels = {
  active: "ใช้งาน",
  pending: "รออนุมัติ",
  inactive: "ไม่ใช้งาน",
}

const roleStyles = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  staff: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
}

const roleLabels = {
  admin: "หัวหน้า",
  staff: "เจ้าหน้าที่",
}

export default function StaffManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string>("all")

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || staff.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">จัดการเจ้าหน้าที่</h1>
            <p className="text-muted-foreground">รายชื่อเจ้าหน้าที่ทั้งหมด {staffList.length} คน</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มเจ้าหน้าที่
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>เพิ่มเจ้าหน้าที่ใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลเจ้าหน้าที่ใหม่ (จะส่งคำเชิญทางอีเมล)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="ชื่อ-นามสกุล" />
                <Input placeholder="อีเมล" type="email" />
                <Input placeholder="เบอร์โทรศัพท์" />
                <Input placeholder="ตำแหน่ง" />
              </div>
              <DialogFooter>
                <Button variant="outline">ยกเลิก</Button>
                <Button>บันทึก</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาชื่อ, อีเมล..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  ทั้งหมด
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                >
                  ใช้งาน
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                >
                  รออนุมัติ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff List */}
        <div className="grid gap-4">
          {filteredStaff.map((staff) => (
            <Card key={staff.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={staff.avatar ?? undefined} />
                    <AvatarFallback>{staff.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{staff.name}</h3>
                      <Badge className={statusStyles[staff.status]}>
                        {statusLabels[staff.status]}
                      </Badge>
                      <Badge className={roleStyles[staff.role]}>
                        {roleLabels[staff.role]}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">{staff.position}</p>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {staff.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {staff.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        {staff.station}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">ไม่พบเจ้าหน้าที่ที่ค้นหา</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
