import * as z from "zod";

export const customerFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Customer name is required" })
    .max(100, "Customer name must be 100 characters or less"),
  email: z
    .string()
    .min(1, { message: "Customer email is required" })
    .email({ message: "Invalid email address" }),
  blocked: z.boolean().optional(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
