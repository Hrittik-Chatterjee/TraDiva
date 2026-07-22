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

export async function createCategoryAction(prevState: unknown, formData: FormData) {
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
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "23505") {
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
  } catch {
    return { error: "Failed to delete category (it may contain active products)" };
  }
}

// --- Product Actions ---

export async function createProductAction(input: unknown) {
  const result = productSchema.safeParse(input);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    if (result.data.isFeatured && result.data.isActive) {
      const activeFeaturedCount = await import("@/services/catalog").then((m) => m.getActiveFeaturedCount());
      if (activeFeaturedCount >= 6) {
        return { error: "Featured quota full! Already 6 featured products added to homepage. Maximum limit reached. Please un-feature an existing product first." };
      }
    }

    const id = await createProduct({
      name: result.data.name,
      slug: result.data.slug,
      description: result.data.description,
      price: Math.round(result.data.price * 100), // convert to cents
      images: result.data.images,
      videos: result.data.videos,
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
    revalidatePath("/");
    return { success: true, id };
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "23505") {
      return { error: "Product slug already exists" };
    }
    console.error("Product creation action error:", error);
    return { error: "Failed to create product" };
  }
}

export async function updateProductAction(id: string, input: unknown) {
  const result = productSchema.safeParse(input);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    if (result.data.isFeatured && result.data.isActive) {
      const existingProducts = await import("@/services/catalog").then((m) => m.getProducts());
      const currentProduct = existingProducts.find((p) => p.id === id);
      if (!currentProduct?.isFeatured) {
        const activeFeaturedCount = await import("@/services/catalog").then((m) => m.getActiveFeaturedCount());
        if (activeFeaturedCount >= 6) {
          return { error: "Featured quota full! Already 6 featured products added to homepage. Maximum limit reached. Please un-feature an existing product first." };
        }
      }
    }

    await updateProduct(id, {
      name: result.data.name,
      slug: result.data.slug,
      description: result.data.description,
      price: Math.round(result.data.price * 100), // convert to cents
      images: result.data.images,
      videos: result.data.videos,
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
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "23505") {
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
    revalidatePath("/catalog");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Product delete action error:", error);
    return {
      error: "Cannot delete this product because it is linked to existing customer orders.",
      isForeignKeyError: true,
    };
  }
}

export async function toggleProductActiveAction(id: string, isActive: boolean) {
  try {
    const existingProducts = await import("@/services/catalog").then((m) => m.getProducts());
    const existing = existingProducts.find((p) => p.id === id);
    if (!existing) {
      return { error: "Product not found" };
    }

    await updateProduct(id, {
      name: existing.name,
      slug: existing.slug,
      description: existing.description,
      price: existing.price,
      images: existing.images,
      videos: existing.videos || [],
      categoryId: existing.category?.id || "",
      stock: existing.stock || 0,
      isFeatured: isActive ? existing.isFeatured : false,
      isActive,
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/catalog");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Product toggle active action error:", error);
    return { error: "Failed to update product status" };
  }
}

export async function toggleProductFeaturedAction(id: string, isFeatured: boolean) {
  try {
    const existingProducts = await import("@/services/catalog").then((m) => m.getProducts());
    const existing = existingProducts.find((p) => p.id === id);
    if (!existing) {
      return { error: "Product not found" };
    }

    if (isFeatured && existing.isActive) {
      const activeFeaturedCount = await import("@/services/catalog").then((m) => m.getActiveFeaturedCount());
      if (activeFeaturedCount >= 6) {
        return {
          error: "Featured quota full! Already 6 featured products added to homepage. Maximum limit reached. Please un-feature an existing product first.",
          isQuotaFull: true,
        };
      }
    }

    await updateProduct(id, {
      name: existing.name,
      slug: existing.slug,
      description: existing.description,
      price: existing.price,
      images: existing.images,
      videos: existing.videos || [],
      categoryId: existing.category?.id || "",
      stock: existing.stock || 0,
      isFeatured,
      isActive: existing.isActive,
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Product toggle featured action error:", error);
    return { error: "Failed to update featured status" };
  }
}
