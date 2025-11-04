export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const BackendURL = process.env.BACKEND_URL
  ? process.env.BACKEND_URL
  : "http://qg8w48gw40gsc0oo4gsss8gg.91.99.224.155.sslip.io";
