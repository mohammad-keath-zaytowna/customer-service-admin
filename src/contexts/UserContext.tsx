"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/helpers/axiosInstance";

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
  refetch: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isLoading: true,
  refetch: async () => Promise.resolve(),
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isAuthPolling, setAuthPolling] = useState(false);

  // Poll or invalidate when needed: we don't have supabase.onAuthStateChange, so
  // callers should call queryClient.invalidateQueries(['user-profile']) after login/logout.

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/users/me");
        return {
          user: res.data?.user ?? null,
          profile: res.data?.user ?? null,
        };
      } catch (err) {
        return { user: null, profile: null };
      }
    },
    staleTime: Infinity,
  });

  const value = {
    user: data?.user ?? null,
    profile: data?.profile ?? null,
    isLoading,
    refetch,
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
