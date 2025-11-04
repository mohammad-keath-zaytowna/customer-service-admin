import { NextResponse } from "next/server";

import { passwordUpdateFormSchema } from "@/app/(authentication)/update-password/_components/schema";
import validateFormData from "@/helpers/validateFormData";

export async function POST(request: Request) {
  const { password, confirmPassword, code } = await request.json();

  const { errors } = validateFormData(passwordUpdateFormSchema, {
    password,
    confirmPassword,
  });
  if (errors) {
    return NextResponse.json({ errors }, { status: 401 });
  }

  try {
    const backendRes = await fetch(
      `${
        process.env.BACKEND_URL || "https://api-lamsa.sadiq-store.com"
      }/auth/update-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code }),
      }
    );

    const payload = await backendRes.json();
    if (!backendRes.ok) {
      return NextResponse.json(
        {
          errors: payload?.errors ?? { password: payload?.message ?? "Failed" },
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error forwarding update-password to backend", err);
    return NextResponse.json({ errors: { general: "Error" } }, { status: 500 });
  }
}
