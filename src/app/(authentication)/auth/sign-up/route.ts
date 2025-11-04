import { NextResponse } from "next/server";

import { signupFormSchema } from "@/app/(authentication)/signup/_components/schema";
import validateFormData from "@/helpers/validateFormData";

export async function POST(request: Request) {
  // Get form fields
  const { name, email, password, confirmPassword, privacy } =
    await request.json();

  // Server side form validation
  const { errors } = validateFormData(signupFormSchema, {
    name,
    email,
    password,
    confirmPassword,
    privacy,
  });

  // If there are validation errors, return a JSON response with the errors and a 401 status.
  if (errors) {
    return NextResponse.json({ errors }, { status: 401 });
  }

  // Proxy sign-up to our backend which will set an HttpOnly cookie
  try {
    const backendRes = await fetch(
      `${
        process.env.BACKEND_URL ||
        "http://qg8w48gw40gsc0oo4gsss8gg.91.99.224.155.sslip.io"
      }/auth/sign-up`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      }
    );

    const payload = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          errors: payload?.errors ?? {
            email: payload?.message ?? "Sign-up failed",
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sign-up proxy error", err);
    return NextResponse.json(
      { errors: { general: "Error signing up" } },
      { status: 500 }
    );
  }
}
