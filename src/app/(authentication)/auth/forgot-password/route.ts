import { NextResponse } from "next/server";

import { passwordResetFormSchema } from "@/app/(authentication)/forgot-password/_components/schema";
import validateFormData from "@/helpers/validateFormData";

export async function POST(request: Request) {
  const { email } = await request.json();

  const { errors } = validateFormData(passwordResetFormSchema, { email });
  if (errors) {
    return NextResponse.json({ errors }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, redirectTo: `${process.env.SITE_URL || 'http://localhost:3000'}/update-password` }),
    });

    const payload = await backendRes.json();
    if (!backendRes.ok) {
      return NextResponse.json({ errors: payload?.errors ?? { email: payload?.message ?? 'Failed' } }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error forwarding forgot-password to backend', err);
    return NextResponse.json({ errors: { general: 'Error' } }, { status: 500 });
  }
}
