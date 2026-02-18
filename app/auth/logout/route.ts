import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url))

  response.cookies.set("user_role", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })

  response.cookies.set("user_name", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })

  response.cookies.set("user_email", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })

  return response
}
