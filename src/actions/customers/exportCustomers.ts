"use server";

import axios from "@/helpers/axiosInstance";

export async function exportCustomers(token?: string) {
  try {
    // The backend exposes GET /api/users which returns { users }
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined;

    const res = await axios.get('/api/users', config);

    // Normalize to { data } same as previous implementation
    const data = res.data?.users ?? [];
    return { data };
  } catch (err: any) {
    console.error(`Error fetching customers from backend:`, err?.response ?? err?.message ?? err);
    return { error: `Failed to fetch data for customers.` };
  }
}
