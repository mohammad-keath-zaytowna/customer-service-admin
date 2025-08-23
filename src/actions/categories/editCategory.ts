"use server";

import { revalidatePath } from "next/cache";

import { createServerActionClient } from "@/lib/supabase/server-action";
import { categoryFormSchema } from "@/app/(dashboard)/categories/_components/form/schema";
import { formatValidationErrors } from "@/helpers/formatValidationErrors";
import { CategoryServerActionResponse } from "@/types/server-action";

export async function editCategory(
  categoryId: string,
  formData: FormData
): Promise<CategoryServerActionResponse> {
  const supabase = createServerActionClient();

  const parsedData = categoryFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    slug: formData.get("slug"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { image, ...categoryData } = parsedData.data;

  let imageUrl: string | undefined;

  if (image instanceof File && image.size > 0) {
    const { data: oldCategoryData, error: fetchError } = await supabase
      .from("categories")
      .select("image_url")
      .eq("id", categoryId)
      .single();

    if (fetchError) {
      console.error("Failed to fetch old category data:", fetchError);
      return { dbError: "Could not find the category to update." };
    }

    const oldImageUrl = oldCategoryData.image_url;

    const fileExt = image.name.split(".").pop();
    const fileName = `categories/${categoryData.slug}-${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("assets")
      .upload(fileName, image);

    if (uploadError) {
      console.error("Image upload failed:", uploadError);
      return { validationErrors: { image: "Failed to upload image" } };
    }

    const { data: publicUrlData } = supabase.storage
      .from("assets")
      .getPublicUrl(uploadData.path);

    imageUrl = publicUrlData.publicUrl;

    if (oldImageUrl) {
      const oldImageFileName = oldImageUrl.split("/").pop();

      if (oldImageFileName) {
        await supabase.storage.from("assets").remove([oldImageFileName]);
      }
    }
  }

  const { data: updatedCategory, error: dbError } = await supabase
    .from("categories")
    .update({
      name: categoryData.name,
      description: categoryData.description,
      slug: categoryData.slug,
      ...(imageUrl && { image_url: imageUrl }),
    })
    .eq("id", categoryId)
    .select()
    .single();

  if (dbError) {
    if (dbError.code === "23505") {
      const match = dbError.details.match(/\(([^)]+)\)/);
      const uniqueColumn = match ? match[1] : null;

      if (uniqueColumn === "slug") {
        return {
          validationErrors: {
            slug: "This category slug is already in use. Please choose a different one.",
          },
        };
      } else if (uniqueColumn === "name") {
        return {
          validationErrors: {
            name: "A category with this name already exists. Please enter a unique name for this category.",
          },
        };
      }
    }

    console.error("Database update failed:", dbError);
    return { dbError: "Something went wrong. Please try again later." };
  }

  revalidatePath("/categories");

  return { success: true, category: updatedCategory };
}
