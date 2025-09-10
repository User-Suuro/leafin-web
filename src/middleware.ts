import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-middleware-processed", "true");

  // You might use `req` here later, e.g. logging or conditional logic
  console.log("Middleware processing:", req.url);

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
