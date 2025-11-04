import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      await fetch(
        `${
          process.env.BACKEND_URL ||
          "http://qg8w48gw40gsc0oo4gsss8gg.91.99.224.155.sslip.io"
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
