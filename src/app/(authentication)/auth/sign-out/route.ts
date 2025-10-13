import { NextResponse } from "next/server";

import { siteUrl } from "@/constants/siteUrl";

export async function POST() {
  try {
    await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/sign-out`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Error calling backend sign-out', err);
  }

  return NextResponse.redirect(`${siteUrl}/login`, {
    status: 301,
  });
}
