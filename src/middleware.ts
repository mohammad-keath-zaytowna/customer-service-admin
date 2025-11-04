import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Use backend shim to get session info
  let session = null;
  try {
    const response = await fetch(
      `${
        process.env.BACKEND_URL || "https://api-lamsa.sadiq-store.com"
      }/api/users/me`,
      {
        headers: {
          // Pass cookies if your backend uses them for auth
          Authentication: req.headers.get("Authentication") || "",
          cookie: req.headers.get("cookie") || "",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();

      session = data?.user ? { user: data.user } : null;
    }
  } catch (e) {
    session = null;
  }

  const authRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/update-password",
  ];

  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);
  const isLoggedIn = !!session?.user;

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isLoggedIn && !isAuthRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_to", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth|.*\\..*).*)"],
};
