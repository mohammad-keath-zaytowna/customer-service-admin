"use server";

import { ServerActionResponse } from "@/types/server-action";
import { OrderStatus } from "@/services/orders/types";
import axiosInstance from "@/helpers/axiosInstance";
import { revalidatePath } from "next/cache";

export async function changeOrderStatus(
  orderId: string,
  newOrderStatus: OrderStatus
): Promise<ServerActionResponse> {
  const headers: Record<string, string> = {};
  const { cookies } = await import("next/headers");
  const token = cookies().get("token")?.value;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const { data } = await axiosInstance.patch(
    `/api/orders/${orderId}/status`,
    {
      status: newOrderStatus,
    },
    {
      headers,
    }
  );
  revalidatePath("/orders");

  return data;
}
