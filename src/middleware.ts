import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-middleware-processed", "true");

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
