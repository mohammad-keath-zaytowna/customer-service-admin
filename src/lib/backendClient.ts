import axios from "@/helpers/axiosInstance";

// Lightweight shim to replace Supabase helpers during migration.
// This exposes the minimal functions the app expects: createBrowserClient,
// createServerClient, createServerActionClient, createRouteHandlerClient,
// createMiddlewareClient. They return objects with common methods used in the app.

const createBrowserClient = () => {
  return {
    auth: {
      async getSession() {
        // Call backend endpoint that returns session/user
        const res = await axios.get("/api/users/me");
        return {
          data: { session: res.data?.user ? { user: res.data.user } : null },
        };
      },
      // no-op signInWithOAuth placeholder
      async signInWithOAuth() {
        throw new Error(
          "OAuth sign-in not supported in backend shim; please use backend auth endpoints"
        );
      },
      onAuthStateChange() {
        // Supabase returns a subscription object; provide stub with unsubscribe
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
    from() {
      throw new Error("Use backend REST endpoints directly instead of from()");
    },
    authGetUser: async () => {
      const res = await axios.get("/api/users/me");
      return { data: { user: res.data?.user ?? null } };
    },
  };
};

const createServerClient = () => {
  // server-side: use fetch to backend
  return {
    async authGetUser() {
      const backendUrl =
        process.env.BACKEND_URL || "https://api-lamsa.sadiq-store.com";
      const res = await fetch(`${backendUrl}/api/users/me`, {
        credentials: "include",
      });
      if (!res.ok) return { data: { user: null } };
      const payload = await res.json();
      return { data: { user: payload.user } };
    },
    from() {
      throw new Error("Use backend REST endpoints directly instead of from()");
    },
    rpc() {
      throw new Error(
        "RPC calls should be replaced with backend REST endpoints"
      );
    },
  };
};

const createServerActionClient = createServerClient;
const createRouteHandlerClient = createServerClient;
const createMiddlewareClient = ({ req, res }: any) => createServerClient();

export {
  createBrowserClient,
  createServerClient,
  createServerActionClient,
  createRouteHandlerClient,
  createMiddlewareClient,
};

export default createBrowserClient;
