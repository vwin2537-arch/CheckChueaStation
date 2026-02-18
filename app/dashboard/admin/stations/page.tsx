"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  MapPin,
  Plus,
  Edit,
  Trash2,
  QrCode,
  MapPinned,
  Radio,
  Copy,
  Check,
} from "lucide-react"

// Mock stations data
const stationsList = [
  {
    id: "1",
    name: "จุดสแกน A - ด่านหลัก",
    description: "จุดสแกนหลักที่ทำการ",
    latitude: 14.12345,
    longitude: 100.54321,
    radius: 150,
    status: "active" as const,
    scansToday: 18,
  },
  {
    id: "2",
    name: "จุดสแกน B - หน่วยพิทักษ์",
    description: "จุดสแกนหน่วยพิทักษ์ป่าไม้",
    latitude: 14.13456,
    longitude: 100.55432,
    radius: 200,
    status: "active" as const,
    scansToday: 12,
  },
  {
    id: "3",
    name: "จุดสแกน C - ป่าไม้",
    description: "จุดสแกนป่าไม้ทุ่งใหญ่",
    latitude: 14.14567,
    longitude: 100.56543,
    radius: 100,
    status: "active" as const,
    scansToday: 8,
  },
  {
    id: "4",
    name: "จุดสแกน D - หน่วยรักษาการ",
    description: "จุดสแกนหน่วยรักษาการ",
    latitude: 14.15678,
    longitude: 100.57654,
    radius: 150,
    status: "inactive" as const,
    scansToday: 0,
  },
]

export default function StationsManagementPage() {
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const handleCopyQR = (stationId: string) => {
    // Mock copy QR URL
    navigator.clipboard.writeText(`https://attendance.example.com/scan/${stationId}`)
    setCopiedId(stationId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">จัดการจุดสแกน</h1>
            <p className="text-muted-foreground">จุดสแกน QR Code ทั้งหมด {stationsList.length} จุด</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มจุดสแกน
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>เพิ่มจุดสแกนใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลจุดสแกน QR Code ใหม่
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="ชื่อจุดสแกน" />
                <Input placeholder="คำอธิบาย" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="ละติจูด" type="number" step="0.00001" />
                  <Input placeholder="ลองจิจูด" type="number" step="0.00001" />
                </div>
                <Input placeholder="รัศมี (เมตร)" type="number" />
                <p className="text-xs text-muted-foreground">
                  💡 ใช้ Google Maps กดหาพิกัด GPS ของจุดที่ต้องการ
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline">ยกเลิก</Button>
                <Button>บันทึก</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stations Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {stationsList.map((station) => (
            <Card key={station.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{station.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{station.description}</p>
                    </div>
                  </div>
                  <Badge variant={station.status === "active" ? "success" : "secondary"}>
                    {station.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* GPS Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPinned className="w-4 h-4" />
                    <span>{station.latitude.toFixed(5)}, {station.longitude.toFixed(5)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Radio className="w-4 h-4" />
                    <span>รัศมี {station.radius} ม.</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">สแกนวันนี้</span>
                  <span className="font-bold text-lg">{station.scansToday}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopyQR(station.id)}
                  >
                    {copiedId === station.id ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        คัดลอกแล้ว
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        คัดลอก QR
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <QrCode className="w-4 h-4 mr-1" />
                    แสดง QR
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinned className="w-5 h-5 text-primary" />
              แผนที่จุดสแกน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>แผนที่จะแสดงจุดสแกนทั้งหมด</p>
                <p className="text-sm">(Google Maps Integration)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
