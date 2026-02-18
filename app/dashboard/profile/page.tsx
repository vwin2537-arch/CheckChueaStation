"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppSession } from "@/components/auth/session-provider"
import { UserCircle2 } from "lucide-react"

export default function ProfilePage() {
  const session = useAppSession()
  const fallbackInitials = session.displayName.trim().slice(0, 2) || "US"

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">โปรไฟล์ของฉัน</h1>
          <p className="text-muted-foreground">แก้ไขข้อมูลส่วนตัวของคุณ</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle2 className="w-5 h-5 text-primary" />
              ข้อมูลผู้ใช้งาน
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/avatar.png" alt="Profile" />
                <AvatarFallback>{fallbackInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{session.displayName}</p>
                <p className="text-sm text-muted-foreground">{session.email}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Input placeholder="ชื่อ-นามสกุล" defaultValue={session.displayName} />
              <Input placeholder="เบอร์โทรศัพท์" defaultValue="08x-xxx-xxxx" />
              <Input placeholder="อีเมล" defaultValue={session.email} className="md:col-span-2" />
            </div>

            <Button>บันทึกการเปลี่ยนแปลง</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
