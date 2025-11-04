import { NextResponse } from "next/server";

import { loginFormSchema } from "@/app/(authentication)/login/_components/schema";
import validateFormData from "@/helpers/validateFormData";

export async function POST(request: Request) {
  // Get form fields
  const { email, password } = await request.json();

  // Server side form validation
  const { errors } = validateFormData(loginFormSchema, {
    email,
    password,
  });

  // If there are validation errors, return a JSON response with the errors and a 401 status.
  if (errors) {
    return NextResponse.json({ errors }, { status: 401 });
  }

  // Proxy sign-in to our backend which will set an HttpOnly cookie
  try {
    const backendRes = await fetch(
      `${
        process.env.BACKEND_URL ||
        "http://qg8w48gw40gsc0oo4gsss8gg.91.99.224.155.sslip.io"
      }/api/users/auth/sign-in`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        // keep redirect behavior default
      }
    );

    const payload = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { errors: payload?.errors ?? { general: "Invalid credentials" } },
        { status: 401 }
      );
    }

    // Backend sets HttpOnly cookie; forward Set-Cookie header to client and redirect
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirect_to") || "/";

    // Grab Set-Cookie header from backend response (if any)
    const backendSetCookie = backendRes.headers.get("set-cookie");

    const response = NextResponse.redirect(redirectTo);
    if (backendSetCookie) {
      // Forward cookie so browser stores it for subsequent requests
      response.headers.set("Set-Cookie", backendSetCookie);
    }

    return response;
  } catch (err) {
    console.error("Sign-in proxy error", err);
    return NextResponse.json(
      { errors: { general: "Error signing in" } },
      { status: 500 }
    );
  }
}
