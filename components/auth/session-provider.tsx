"use client"

import * as React from "react"
import type { AppRole } from "@/lib/auth"

type SessionContextValue = {
  role: AppRole | null
  displayName: string
  email: string
}

const SessionContext = React.createContext<SessionContextValue>({
  role: null,
  displayName: "ผู้ใช้งาน",
  email: "-",
})

interface SessionProviderProps {
  children: React.ReactNode
  value: SessionContextValue
}

export function SessionProvider({ children, value }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

export function useAppSession() {
  return React.useContext(SessionContext)
}
