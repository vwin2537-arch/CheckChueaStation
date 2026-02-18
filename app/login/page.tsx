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
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">เข้าสู่ระบบ Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/auth/demo-login?role=admin">เข้าใช้งานในบทบาทแอดมิน</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/demo-login?role=staff">เข้าใช้งานในบทบาทเจ้าหน้าที่</Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            (Demo) ภายหลังจะเชื่อม LINE Login + Email/Password
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
