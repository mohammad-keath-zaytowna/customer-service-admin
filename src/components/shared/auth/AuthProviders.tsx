"use client";

import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { siteUrl } from "@/constants/siteUrl";

import { Button } from "@/components/ui/button";

type AuthProvider = "github" | "google";

type Props = {
  authType?: "Login" | "Signup";
};

export default function AuthProviders({ authType = "Login" }: Props) {
  // Redirect to backend OAuth start endpoint which initiates provider flow
  const handleAuth = (authProvider: AuthProvider) => {
    const backend =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://qg8w48gw40gsc0oo4gsss8gg.91.99.224.155.sslip.io";
    const url = `${backend}/auth/oauth/${authProvider}?redirectTo=${encodeURIComponent(
      `${siteUrl}/auth/callback`
    )}`;
    window.location.assign(url);
  };

  return (
    <div className="space-y-4 mb-10">
      <Button
        onClick={() => handleAuth("github")}
        variant="secondary"
        className="w-full min-h-14"
      >
        <FaGithub className="mr-3 size-4" />
        {authType} With Github
      </Button>

      <Button
        onClick={() => handleAuth("google")}
        variant="secondary"
        className="w-full min-h-14"
      >
        <FcGoogle className="mr-3 size-4" />
        {authType} With Google
      </Button>
    </div>
  );
}
