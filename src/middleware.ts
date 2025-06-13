import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";

const admin_ips: string[] =
  process.env.ADMIN_IPS?.split(",").map((id) => id.trim()) || [];

export async function middleware(request: NextRequest) {
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
  matcher: ["/admin/:path*", "/admin/(.*)", "/admin2/:path*", "/admin2/(.*)"],
};
