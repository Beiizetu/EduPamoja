// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/group(.*)"])

export default clerkMiddleware(async (auth, req) => {
  // FIX #1: Use an environment variable for the base host, not localhost.
  // This should be your main production domain.
  // For Vercel, this will be 'edu-pamoja.vercel.app'
  const baseHost = process.env.NEXT_PUBLIC_APP_URL!

  const host = req.headers.get("host")!
  const reqPath = req.nextUrl.pathname
  const origin = req.nextUrl.origin

  // Protect routes starting with /group
  if (isProtectedRoute(req)) {
    auth().protect()
  }

  // Check if it's a custom domain AND the path is a group path
  if (host !== baseHost && reqPath.includes("/group")) {
    const response = await fetch(`${origin}/api/domain?host=${host}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    if (data.status === 200 && data) {
      // Rewrite to the correct path structure for a custom domain
      // Example: group.acme.com/group/123 -> rewrite to -> acme.com/group/123
      return NextResponse.rewrite(
        new URL(reqPath, `https://${data.domain}/${reqPath}`),
      )
    }
  }

  // Allow all other requests to proceed
  return NextResponse.next()
})

export const config = {
  // FIX #2: Exclude the API route that the middleware calls to prevent an infinite loop.
  // We use a "negative lookahead" `(?!...)` to exclude `/api/domain`.
  matcher: ["/((?!api/domain|.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}