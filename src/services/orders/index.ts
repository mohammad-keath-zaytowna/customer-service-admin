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
  const token = localStorage.getItem("token");
  const { data } = await axiosInstance.get(`/api/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data as { order: Order };
}
