import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRequestOrigin } from "lucia";
import { cookies as getCookies, headers } from "next/headers";
import { lucia } from "@/lib/auth";

const admin_ips: string[] =
  process.env.ADMIN_IPS?.split(",").map((id) => id.trim()) || [];

const isLoggedIn = async () => {
  const cookies = await getCookies();
  const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;
  return Boolean(sessionId);
};

const handleCSRF = (request: NextRequest) => {
  if (request.method === "GET") {
    return;
  }
  const originHeader = request.headers.get("Origin");
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.get("Host");
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return;
};

export async function middleware(request: NextRequest) {
  const res = handleCSRF(request);
  if (res) return res;
  const isAuthenticated = await isLoggedIn();
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (process.env.ENVIRONMENT === "dev") {
    return;
  }

  const headersList = headers();
  const forwardedFor = (await headersList).get("x-forwarded-for");

  const ipAddress = forwardedFor?.split(",").at(0) ?? undefined;

  if (ipAddress && admin_ips.includes(ipAddress)) {
    return;
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/admin/(.*)"],
};
