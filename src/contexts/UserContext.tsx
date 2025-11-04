"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/helpers/axiosInstance";
import { usePathname, useRouter } from "next/navigation";
import { set } from "date-fns";
import axiosInstance from "@/helpers/axiosInstance";

export type UserRole = string | null;

type UserProfile = {
  name: string | null;
  image_url?: string | null;
  role: UserRole | null;
};

type UserContextType = {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isLoading: true,
  logout: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isAuthPolling, setAuthPolling] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();
  const path = usePathname();
  const authpaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/update-password",
  ];

  // Poll or invalidate when needed: we don't have supabase.onAuthStateChange, so
  // callers should call queryClient.invalidateQueries(['user-profile']) after login/logout.

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/users/me");
        if (!res.data?.user && !authpaths.includes(path)) {
          router.push("/login");
        } else if (res.data?.user && authpaths.includes(path)) {
          router.push("/");
        }
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data?.token}`;
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data?.token}`;

        setUser(res.data?.user ?? null);
        return {
          user: res.data?.user ?? null,
          profile: res.data?.profile ?? null,
        };
      } catch (err) {
        setUser(null);
        if (!authpaths.includes(path)) {
          router.push("/login");
        }
        return { user: null, profile: null };
      }
    },
    staleTime: Infinity,
  });

  const logout = async () => {
    try {
      // Call backend logout if available (clears cookie on server)
      await axios.post(
        "/api/users/auth/sign-out",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.warn("Logout request failed, continuing cleanup");
    }
    // Clear any local tokens if used
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token"); // just in case you store it there
    sessionStorage.removeItem("token");

    // Clear react-query cache & local user state
    queryClient.clear();
    setUser(null);

    router.push("/login");
  };

  const value = {
    user: user,
    profile: user,
    isLoading,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
