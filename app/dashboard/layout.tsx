import { redirect } from "next/navigation"
import { getAppSession } from "@/lib/auth"
import { SessionProvider } from "@/components/auth/session-provider"

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAppSession()

  if (!session.isAuthenticated) {
    redirect("/login")
  }

  return (
    <SessionProvider
      value={{
        role: session.role,
        displayName: session.displayName,
        email: session.email,
      }}
    >
      {children}
    </SessionProvider>
  )
}
