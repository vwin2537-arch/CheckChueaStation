import { redirect } from "next/navigation"
import Link from "next/link"
import { getAppSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function LoginPage() {
  const session = await getAppSession()

  if (session.isAuthenticated) {
    redirect(session.role === "admin" ? "/dashboard" : "/dashboard/staff")
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 gradient-bg">
      <Card className="w-full max-w-md modern-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">เข้าสู่ระบบ Attendance</CardTitle>
          <p className="text-gray-600">ระบบเช็คชื่อและจัดการการลา</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full modern-button bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
            <Link href="/auth/demo-login?role=admin">เข้าใช้งานในบทบาทแอดมิน</Link>
          </Button>
          <Button asChild variant="outline" className="w-full modern-button border-2 border-orange-200 text-orange-600 hover:bg-orange-50">
            <Link href="/auth/demo-login?role=staff">เข้าใช้งานในบทบาทเจ้าหน้าที่</Link>
          </Button>
          <p className="text-xs text-gray-500 text-center mt-4">
            (Demo) ภายหลังจะเชื่อม LINE Login + Email/Password
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
