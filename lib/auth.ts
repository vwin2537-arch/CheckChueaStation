import { cookies } from "next/headers"

export type AppRole = "admin" | "staff"

export interface AppSession {
  isAuthenticated: boolean
  role: AppRole | null
  displayName: string
  email: string
}

export async function getAppSession(): Promise<AppSession> {
  const cookieStore = await cookies()
  const role = cookieStore.get("user_role")?.value
  const fallbackName = role === "admin" ? "หัวหน้าสถานี" : "เจ้าหน้าที่"
  const displayName = cookieStore.get("user_name")?.value ?? fallbackName
  const defaultEmail = role === "admin" ? "admin@checkchuea.local" : "staff@checkchuea.local"
  const email = cookieStore.get("user_email")?.value ?? defaultEmail

  if (role !== "admin" && role !== "staff") {
    return {
      isAuthenticated: false,
      role: null,
      displayName,
      email,
    }
  }

  return {
    isAuthenticated: true,
    role,
    displayName,
    email,
  }
}
