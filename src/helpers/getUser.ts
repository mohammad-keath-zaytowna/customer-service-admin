/**
 * getUser - Server helper to retrieve user information from backend via cookies.
 * Returns the user object or null.
 */
export async function getUser(): Promise<any | null> {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/api/users/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // Cookies are sent automatically by Next's fetch in server environment when using relative URLs.
      // For external backend we rely on the browser to include cookies; ensure BACKEND_URL matches origin.
    });

    if (!res.ok) return null;
    const payload = await res.json();
    return payload?.user ?? null;
  } catch (err) {
    console.error("Error fetching user from backend:", err);
    return null;
  }
}
