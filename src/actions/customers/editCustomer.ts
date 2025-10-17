"use server";

import { revalidatePath } from "next/cache";
import axiosInstance from "@/helpers/axiosInstance";
import { customerFormSchema } from "@/app/(dashboard)/customers/_components/form/schema";
import { formatValidationErrors } from "@/helpers/formatValidationErrors";
import { CustomerServerActionResponse } from "@/types/server-action";

export async function editCustomer(
  customerId: string,
  formData: FormData
): Promise<CustomerServerActionResponse> {
  const parsedData = customerFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    blocked: formData.get("blocked") === "true",
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const customerData = parsedData.data;
  const headers: Record<string, string> = {};
  const { cookies } = await import("next/headers");
  const token = cookies().get("token")?.value;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await axiosInstance.patch(
      `/api/users/${customerId}`,
      {
        name: customerData.name,
        email: customerData.email,
        blocked: customerData.blocked,
      },
      {
        headers,
      }
    );

    revalidatePath("/");
    if (res.status !== 200) {
      console.error("Backend update failed:", res.data);
      return { dbError: "Something went wrong. Please try again later." };
    }

    const updatedCustomer = res.data.user;
    revalidatePath("/");
    revalidatePath("/customers");
    revalidatePath(`/customer-orders/${updatedCustomer.id}`);

    return { success: true, customer: updatedCustomer };
  } catch (err: any) {
    console.error(
      "Error updating customer:",
      err?.response?.data || err.message || err
    );
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Could not update the customer.";
    return { dbError: message };
  }
}
