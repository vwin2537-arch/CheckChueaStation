import { redirect } from "next/navigation"
import { getAppSession } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAppSession()

  if (!session.isAuthenticated) {
    redirect("/login")
  }

  if (session.role !== "admin") {
    redirect("/dashboard/staff")
  }

  return <>{children}</>
}
