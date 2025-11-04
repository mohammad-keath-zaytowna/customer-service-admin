"use client";

import { ServerActionResponse } from "@/types/server-action";
import { OrderStatus } from "@/services/orders/types";
import axiosInstance from "@/helpers/axiosInstance";
import { revalidatePath } from "next/cache";

export async function changeOrderStatus(
  orderId: string,
  newOrderStatus: OrderStatus
): Promise<ServerActionResponse> {
  const { data } = await axiosInstance.patch(
    `/api/orders/${orderId}/status`,
    {
      status: newOrderStatus,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return data;
}
