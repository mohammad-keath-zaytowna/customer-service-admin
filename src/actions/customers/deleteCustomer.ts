"use server";

import { revalidatePath } from "next/cache";
import axiosInstance from "@/helpers/axiosInstance";
import { ServerActionResponse } from "@/types/server-action";

export async function deleteCustomer(
  customerId: string
): Promise<ServerActionResponse> {
  try {
    const res = await axiosInstance.delete(`/api/users/${customerId}`);

    if (res.status !== 200) {
      console.error("Backend delete failed:", res.data);
      return { dbError: "Something went wrong. Could not delete the customer." };
    }

    revalidatePath("/customers");

    return { success: true };
  } catch (err: any) {
    console.error("Error deleting customer:", err?.response?.data || err.message || err);
    const message = err?.response?.data?.message || err?.message || "Could not delete the customer.";
    return { dbError: message };
  }
}
