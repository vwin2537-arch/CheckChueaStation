import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const role = request.cookies.get("user_role")?.value

  const isAuthenticated = role === "admin" || role === "staff"

  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (role === "staff") {
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard/staff", request.url))
    }

    const allowedStaffPrefixes = [
      "/dashboard/staff",
      "/dashboard/scan",
      "/dashboard/history",
      "/dashboard/leave",
      "/dashboard/profile",
    ]

    const isStaffAllowedPath = allowedStaffPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )

    if (!isStaffAllowedPath) {
      return NextResponse.redirect(new URL("/dashboard/staff", request.url))
    }
  }

  if (role === "admin") {
    if (pathname === "/dashboard/staff") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
