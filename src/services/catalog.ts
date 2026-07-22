import { db } from "../../db";
import { products, inventory, categories } from "../../db/schema";
import { SQL, eq, desc, asc, and, or, gte, lte, inArray, ilike } from "drizzle-orm";
import { cleanupExpiredPendingOrders } from "./order";

// --- Category Services ---

export async function getCategories() {
  return await db.select().from(categories).orderBy(desc(categories.createdAt));
}

export async function createCategory(input: { name: string; slug: string; description?: string }) {
  const id = "cat_" + crypto.randomUUID();
  await db.insert(categories).values({
    id,
    name: input.name,
    slug: input.slug,
    description: input.description || null,
  });
  return id;
}

export async function updateCategory(id: string, input: { name: string; slug: string; description?: string }) {
  await db
    .update(categories)
    .set({
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id));
}

export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
}

// --- Product Services ---

export async function getProducts() {
  return await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      images: products.images,
      videos: products.videos,
      isFeatured: products.isFeatured,
      isActive: products.isActive,
      createdAt: products.createdAt,
      category: {
        id: categories.id,
        name: categories.name,
      },
      stock: inventory.stock,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(inventory, eq(products.id, inventory.productId))
    .orderBy(desc(products.createdAt));
}

export async function getProductById(id: string) {
  const results = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      images: products.images,
      videos: products.videos,
      isFeatured: products.isFeatured,
      isActive: products.isActive,
      categoryId: products.categoryId,
      stock: inventory.stock,
    })
    .from(products)
    .leftJoin(inventory, eq(products.id, inventory.productId))
    .where(eq(products.id, id))
    .limit(1);
  return results[0] || null;
}

export async function createProduct(input: {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  videos?: string[];
  categoryId: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
}) {
  const productId = "prod_" + crypto.randomUUID();

  await db.insert(products).values({
    id: productId,
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    images: input.images,
    videos: input.videos || [],
    categoryId: input.categoryId,
    isFeatured: input.isFeatured ?? false,
    isActive: input.isActive ?? true,
  });

  await db.insert(inventory).values({
    id: "inv_" + crypto.randomUUID(),
    productId: productId,
    stock: input.stock,
  });

  return productId;
}

export async function updateProduct(
  id: string,
  input: {
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    videos?: string[];
    categoryId: string;
    stock: number;
    isFeatured: boolean;
    isActive: boolean;
  }
) {
  await db
    .update(products)
    .set({
      name: input.name,
      slug: input.slug,
      description: input.description,
      price: input.price,
      images: input.images,
      videos: input.videos || [],
      categoryId: input.categoryId,
      isFeatured: input.isFeatured ?? false,
      isActive: input.isActive ?? true,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  await db
    .update(inventory)
    .set({
      stock: input.stock,
      updatedAt: new Date(),
    })
    .where(eq(inventory.productId, id));
}

export async function deleteProduct(id: string) {
  // Cascades to inventory automatically via database foreign key constraint
  await db.delete(products).where(eq(products.id, id));
}

export async function getActiveFeaturedCount(): Promise<number> {
  const result = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.isFeatured, true), eq(products.isActive, true)));
  return result.length;
}

export async function getStorefrontFeaturedProducts() {
  return await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      images: products.images,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isFeatured, true), eq(products.isActive, true)))
    .orderBy(desc(products.createdAt))
    .limit(6);
}

// --- Storefront Catalog Services ---

export async function getStorefrontProducts(filters: {
  search?: string;
  categorySlugs?: string[];
  minPrice?: number; /* in cents */
  maxPrice?: number; /* in cents */
  sort?: string;
}) {
  // Lazy cleanup expired pending orders to ensure stock is up to date
  await cleanupExpiredPendingOrders();

  const whereClauses: (SQL | undefined)[] = [eq(products.isActive, true)];

  if (filters.search) {
    whereClauses.push(
      or(
        ilike(products.name, `%${filters.search}%`),
        ilike(products.description, `%${filters.search}%`)
      )
    );
  }

  if (filters.categorySlugs && filters.categorySlugs.length > 0) {
    whereClauses.push(inArray(categories.slug, filters.categorySlugs));
  }

  if (filters.minPrice !== undefined) {
    whereClauses.push(gte(products.price, filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    whereClauses.push(lte(products.price, filters.maxPrice));
  }

  let order = desc(products.createdAt); /* default to newest */
  if (filters.sort === "price_asc") {
    order = asc(products.price);
  } else if (filters.sort === "price_desc") {
    order = desc(products.price);
  }

  return await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      images: products.images,
      videos: products.videos,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
      stock: inventory.stock,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(inventory, eq(products.id, inventory.productId))
    .where(and(...whereClauses))
    .orderBy(order);
}

export async function getProductBySlug(slug: string) {
  // Lazy cleanup expired pending orders to ensure stock is up to date
  await cleanupExpiredPendingOrders();

  const results = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      images: products.images,
      videos: products.videos,
      isFeatured: products.isFeatured,
      isActive: products.isActive,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
      stock: inventory.stock,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(inventory, eq(products.id, inventory.productId))
    .where(eq(products.slug, slug))
    .limit(1);
  return results[0] || null;
}
