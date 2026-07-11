"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/catalog";
import { categorySchema, productSchema } from "@/lib/validation/catalog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { trackServerEvent } from "@/services/posthog";

async function getAdminUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.id || "anonymous_admin";
}

export async function createCategoryAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  const result = categorySchema.safeParse({ name, slug, description });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const id = await createCategory(result.data);
    const userId = await getAdminUserId();
    trackServerEvent(userId, "admin_create_category", {
      categoryId: id,
      name: result.data.name,
      slug: result.data.slug,
    });
    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    if (error.code === "23505") {
      return { error: "Category slug already exists" };
    }
    return { error: "Failed to create category" };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await deleteCategory(id);
    const userId = await getAdminUserId();
    trackServerEvent(userId, "admin_delete_category", { categoryId: id });
    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to delete category (it may contain active products)" };
  }
}

// --- Product Actions ---

export async function createProductAction(input: any) {
  const result = productSchema.safeParse(input);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const id = await createProduct({
      name: result.data.name,
      slug: result.data.slug,
      description: result.data.description,
      price: Math.round(result.data.price * 100), // convert to cents
      images: result.data.images,
      categoryId: result.data.categoryId,
      stock: result.data.stock,
      isFeatured: result.data.isFeatured,
      isActive: result.data.isActive,
    });
    const userId = await getAdminUserId();
    trackServerEvent(userId, "admin_create_product", {
      productId: id,
      name: result.data.name,
      stock: result.data.stock,
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true, id };
  } catch (error: any) {
    if (error.code === "23505") {
      return { error: "Product slug already exists" };
    }
    console.error("Product creation action error:", error);
    return { error: "Failed to create product" };
  }
}

export async function updateProductAction(id: string, input: any) {
  const result = productSchema.safeParse(input);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    await updateProduct(id, {
      name: result.data.name,
      slug: result.data.slug,
      description: result.data.description,
      price: Math.round(result.data.price * 100), // convert to cents
      images: result.data.images,
      categoryId: result.data.categoryId,
      stock: result.data.stock,
      isFeatured: result.data.isFeatured,
      isActive: result.data.isActive,
    });
    const userId = await getAdminUserId();
    trackServerEvent(userId, "admin_update_product", {
      productId: id,
      name: result.data.name,
      stock: result.data.stock,
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    if (error.code === "23505") {
      return { error: "Product slug already exists" };
    }
    console.error("Product update action error:", error);
    return { error: "Failed to update product" };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await deleteProduct(id);
    const userId = await getAdminUserId();
    trackServerEvent(userId, "admin_delete_product", { productId: id });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Product delete action error:", error);
    return { error: "Failed to delete product" };
  }
}
