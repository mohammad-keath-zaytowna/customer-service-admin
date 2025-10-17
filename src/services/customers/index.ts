import {
  Customer,
  FetchCustomersParams,
  FetchCustomersResponse,
  CustomerOrder,
} from "./types";
import axiosInstance from "@/helpers/axiosInstance";

export async function fetchCustomers({
  page = 1,
  limit = 10,
  search,
}: FetchCustomersParams): Promise<FetchCustomersResponse> {
  try {
    const { data } = await axiosInstance.get("/api/users", {
      params: { page, limit, search },
    });

    // expected backend response:
    // { data: [...], total: number, currentPage: number, totalPages: number }
    return data;
  } catch (error: any) {
    console.error("Failed to fetch customers:", error.message);
    throw new Error("Failed to fetch customers");
  }
}

export async function fetchCustomerOrders({
  id,
  page,
  limit,
}: {
  id: string;
  page?: number;
  limit?: number;
}) {
  try {
    const headers: Record<string, string> = {};

    if (typeof window === "undefined") {
      try {
        // dynamic import so this file can still be bundled for the client
        const { cookies } = await import("next/headers");
        const token = cookies().get("token")?.value;
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch (e) {
        // ignore if next/headers isn't available for some reason
      }
    }

    const resp = await axiosInstance.get(`/api/orders/all`, {
      params: { page, limit, userId: id },
      headers,
    });

    const payload = resp.data;

    // Normalize different backend response shapes:
    // - admin `/all` returns { data: [...], pagination: {...} }
    // - `/my-orders` returns { orders: [...] }
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.orders)) return payload.orders;

    // fallback: if shape is unexpected but contains an object with data key
    return payload.data || payload.orders || [];
  } catch (error: any) {
    // If unauthorized, surface a clearer error so callers can handle it.
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      console.error(
        "Unauthorized when fetching customer orders:",
        error.response?.data || error.message
      );
      throw new Error("Unauthorized");
    }

    console.error("Failed to fetch customer orders:", error.message);
    throw new Error("Failed to fetch customer orders");
  }
}
