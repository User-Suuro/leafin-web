import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/api")) {
  //  const authHeader = req.headers.get("authorization");
  //  const apiKey = process.env.API_TCP_KEY;

  //  console.log("API route:", url.pathname);
  //  console.log("Auth header:", authHeader ? "Present" : "Missing");

  // Check if API key is configured
  //   if (!apiKey) {
  //     console.error("API_TCP_KEY environment variable is not set");
  //     return new NextResponse(
  //       JSON.stringify({ error: "Server configuration error" }),
  //       { 
  //         status: 500,
  //         headers: { 'Content-Type': 'application/json' }
  //       }
  //     );
  //   }

  //   // Check if authorization header exists
  //   if (!authHeader) {
  //     return new NextResponse(
  //       JSON.stringify({ error: "Unauthorized – missing Authorization header" }),
  //       { 
  //         status: 401,
  //         headers: { 'Content-Type': 'application/json' }
  //       }
  //     );
  //   }

  //   // Check if it follows Bearer token format
  //   if (!authHeader.startsWith("Bearer ")) {
  //     return new NextResponse(
  //       JSON.stringify({ error: "Unauthorized – invalid Authorization header format. Use: Bearer <token>" }),
  //       { 
  //         status: 401,
  //         headers: { 'Content-Type': 'application/json' }
  //       }
  //     );
  //   }

  //   // Extract and validate the token
  //   const token = authHeader.slice(7);
    
  //   if (!token || token !== apiKey) {
  //     return new NextResponse(
  //       JSON.stringify({ error: "Unauthorized – invalid API key" }),
  //       { 
  //         status: 401,
  //         headers: { 'Content-Type': 'application/json' }
  //       }
  //     );
  //   }

  //   console.log("✅ Authorization successful for:", url.pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*'
};