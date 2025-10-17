import { NextResponse } from "next/server";
import { siteUrl } from "@/constants/siteUrl";
import axiosInstance from "@/helpers/axiosInstance";

export async function POST(req: Request) {
  try {
    // Call your backend logout route
    await fetch(
      `${
        process.env.BACKEND_URL || "http://localhost:5000"
      }/api/users/auth/sign-out`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Cookie: req.headers.get("cookie") || "",
        },
      }
    );
  } catch (err) {
    console.error("Error calling backend sign-out", err);
  }

  // ✅ Delete the cookie from the browser
  const res = NextResponse.redirect(`${siteUrl}/login`, {
    status: 301,
  });

  res.cookies.delete("token"); // <-- removes auth cookie from browser
  axiosInstance.defaults.headers.common["Authorization"] = "";

  return res;
}
