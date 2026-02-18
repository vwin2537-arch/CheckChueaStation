import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role")

  if (role !== "admin" && role !== "staff") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const response = NextResponse.redirect(
    new URL(role === "admin" ? "/dashboard" : "/dashboard/staff", request.url)
  )

  const profile =
    role === "admin"
      ? { name: "สมศักดิ์ ขยัน", email: "admin@checkchuea.local" }
      : { name: "สมชาย ใจดี", email: "staff@checkchuea.local" }

  response.cookies.set("user_role", role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  response.cookies.set("user_name", profile.name, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  response.cookies.set("user_email", profile.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  return response
}
