"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  QrCode,
  Camera,
  MapPin,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react"

type ScanStep = "scan" | "verifying" | "selfie" | "success" | "error"

export default function ScanPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<ScanStep>("scan")
  const [scanResult, setScanResult] = React.useState<{
    stationId: string
    stationName: string
    scanType: "check_in" | "check_out"
  } | null>(null)
  const [verification, setVerification] = React.useState({
    qr: false,
    gps: false,
    gpsDistance: 0,
    device: false,
  })
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  // Mock scan result
  const handleMockScan = () => {
    setScanResult({
      stationId: "station-001",
      stationName: "จุดสแกน A - ด่านหลัก",
      scanType: "check_in",
    })
    setStep("verifying")
    
    // Simulate verification
    setTimeout(() => {
      setVerification({
        qr: true,
        gps: true,
        gpsDistance: 45,
        device: true,
      })
      setTimeout(() => setStep("selfie"), 1000)
    }, 1500)
  }

  const handleCaptureSelfie = () => {
    // Simulate selfie capture and upload
    setStep("success")
  }

  const handleReset = () => {
    setStep("scan")
    setScanResult(null)
    setVerification({ qr: false, gps: false, gpsDistance: 0, device: false })
  }

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">สแกน QR Code</h1>
            <p className="text-muted-foreground">เช็คชื่อเข้า/ออก</p>
          </div>
        </div>

        {/* Scan Step */}
        {step === "scan" && (
          <Card>
            <CardContent className="pt-6">
              <div className="aspect-square bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
                {/* Camera placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <QrCode className="w-24 h-24 text-gray-600" />
                </div>
                
                {/* Scanner overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                    
                    {/* Scanning line animation */}
                    <div className="absolute inset-x-0 h-1 bg-primary/50 animate-pulse" style={{ top: "50%" }} />
                  </div>
                </div>
              </div>

              <p className="text-center text-muted-foreground mt-4">
                จ่อกล้องที่ QR Code บนจุดสแกน
              </p>

              {/* Mock scan button for demo */}
              <Button className="w-full mt-4" onClick={handleMockScan}>
                จำลองการสแกน (Demo)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Verifying Step */}
        {step === "verifying" && scanResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary animate-pulse" />
                กำลังตรวจสอบ...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="font-medium">{scanResult.stationName}</p>
                <p className="text-sm text-muted-foreground">
                  {scanResult.scanType === "check_in" ? "เช็คชื่อเข้า" : "เช็คชื่อออก"}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    QR Code
                  </span>
                  {verification.qr ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    GPS ({verification.gpsDistance} ม.)
                  </span>
                  {verification.gps ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    อุปกรณ์
                  </span>
                  {verification.device ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selfie Step */}
        {step === "selfie" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                ถ่ายเซลฟี่เพื่อยืนยันตัวตน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <Camera className="w-16 h-16 text-gray-600" />
                </div>
                
                {/* Face guide oval */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-64 border-2 border-dashed border-white/30 rounded-full" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  ถ่ายรูปหน้าตรง แสงสว่างพอเห็นใบหน้าชัดเจน
                </p>
              </div>

              <Button className="w-full" size="lg" onClick={handleCaptureSelfie}>
                <Camera className="w-5 h-5 mr-2" />
                ถ่ายรูป
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {step === "success" && scanResult && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-green-600">เช็คชื่อสำเร็จ!</h2>
                <p className="text-muted-foreground mt-1">{scanResult.stationName}</p>
                
                <div className="mt-4 p-4 rounded-lg bg-muted w-full">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">เวลา</span>
                    <span className="font-medium">08:02 น.</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">สถานะ</span>
                    <Badge className="bg-green-500">ตรงเวลา</Badge>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">GPS</span>
                    <span className="font-medium">{verification.gpsDistance} ม.</span>
                  </div>
                </div>

                <Button className="w-full mt-6" onClick={() => router.push("/dashboard")}>
                  กลับหน้าหลัก
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Step */}
        {step === "error" && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-red-600">เช็คชื่อไม่สำเร็จ</h2>
                <p className="text-muted-foreground mt-1">
                  GPS ห่างจากจุดสแกนเกินกำหนด
                </p>
                
                <div className="mt-6 flex gap-3 w-full">
                  <Button variant="outline" className="flex-1" onClick={handleReset}>
                    ลองใหม่
                  </Button>
                  <Button className="flex-1" onClick={() => router.push("/dashboard")}>
                    กลับหน้าหลัก
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
