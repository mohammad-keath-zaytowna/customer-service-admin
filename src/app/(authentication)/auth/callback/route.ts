import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      await fetch(
        `${
          process.env.BACKEND_URL || "https://api-lamsa.sadiq-store.com"
        }/auth/callback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }
      );
    } catch (err) {
      console.error("Error forwarding OAuth code to backend", err);
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}
