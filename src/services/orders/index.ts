import {
  FetchOrdersParams,
  FetchOrdersResponse,
  Order,
  OrderDetails,
} from "./types";
import axiosInstance from "@/helpers/axiosInstance";

export async function fetchOrders({
  page = 1,
  limit = 10,
  search,
  status,
  method,
  startDate,
  endDate,
}: FetchOrdersParams): Promise<FetchOrdersResponse> {
  try {
    const { data } = await axiosInstance.get("/api/orders/all", {
      params: {
        page,
        limit,
        search,
        status,
        method,
        startDate,
        endDate,
      },
    });

    return data;
  } catch (error: any) {
    console.error("Failed to fetch orders:", error.message);
    throw new Error("Failed to fetch orders");
  }
}

export async function fetchOrderDetails({ id }: { id: string }) {
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
  const { data } = await axiosInstance.get(`/api/orders/${id}`, { headers });

  return data as { order: Order };
}
