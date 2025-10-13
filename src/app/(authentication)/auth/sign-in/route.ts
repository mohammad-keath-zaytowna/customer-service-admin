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
      `${process.env.BACKEND_URL || "http://localhost:5000"}/api/users/login`,
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

    // Backend sets HttpOnly cookie; forward success
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sign-in proxy error", err);
    return NextResponse.json(
      { errors: { general: "Error signing in" } },
      { status: 500 }
    );
  }
}
