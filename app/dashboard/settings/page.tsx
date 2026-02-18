"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, MapPin, Clock3, Smartphone } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">ตั้งค่า</h1>
          <p className="text-muted-foreground">กำหนดค่าหลักของระบบเช็คชื่อ</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-primary" />
              ตั้งค่าเวลาการทำงาน
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <Input defaultValue="08:00" placeholder="เวลาเข้างาน" />
            <Input defaultValue="16:00" placeholder="เวลาเลิกงาน" />
            <Input defaultValue="15" placeholder="เกณฑ์สาย (นาที)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              ตั้งค่าเงื่อนไขตำแหน่ง
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input defaultValue="150" placeholder="รัศมีอนุญาต (เมตร)" />
            <Input defaultValue="5" placeholder="คลาดเคลื่อน GPS (เมตร)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              ตั้งค่าอุปกรณ์และความปลอดภัย
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input defaultValue="1" placeholder="จำนวนอุปกรณ์ต่อผู้ใช้" />
            <Input defaultValue="เปิดใช้งาน" placeholder="สถานะตรวจสอบ selfie" />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            บันทึกการตั้งค่า
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
