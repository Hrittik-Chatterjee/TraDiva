import { db } from "../../db";
import { products, inventory, categories, brands } from "../../db/schema";
import { eq, desc, asc, and, or, gte, lte, inArray, ilike } from "drizzle-orm";

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

// --- Brand Services ---

export async function getBrands() {
  return await db.select().from(brands).orderBy(desc(brands.createdAt));
}

export async function createBrand(input: { name: string; slug: string; description?: string; logoUrl?: string }) {
  const id = "brand_" + crypto.randomUUID();
  await db.insert(brands).values({
    id,
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    logoUrl: input.logoUrl || null,
  });
  return id;
}

export async function updateBrand(
  id: string,
  input: { name: string; slug: string; description?: string; logoUrl?: string }
) {
  await db
    .update(brands)
    .set({
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      logoUrl: input.logoUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(brands.id, id));
}

export async function deleteBrand(id: string) {
  await db.delete(brands).where(eq(brands.id, id));
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
      isFeatured: products.isFeatured,
      isActive: products.isActive,
      createdAt: products.createdAt,
      category: {
        id: categories.id,
        name: categories.name,
      },
      brand: {
        id: brands.id,
        name: brands.name,
      },
      stock: inventory.stock,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
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
      isFeatured: products.isFeatured,
      isActive: products.isActive,
      categoryId: products.categoryId,
      brandId: products.brandId,
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
  price: number; // in cents
  images: string[];
  categoryId: string;
  brandId?: string | null;
  stock: number;
  isFeatured?: boolean;
  isActive?: boolean;
}) {
  return await db.transaction(async (tx) => {
    const productId = "prod_" + crypto.randomUUID();

    await tx.insert(products).values({
      id: productId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      price: input.price,
      images: input.images,
      categoryId: input.categoryId,
      brandId: input.brandId || null,
      isFeatured: input.isFeatured ?? false,
      isActive: input.isActive ?? true,
    });

    await tx.insert(inventory).values({
      id: "inv_" + crypto.randomUUID(),
      productId: productId,
      stock: input.stock,
    });

    return productId;
  });
}

export async function updateProduct(
  id: string,
  input: {
    name: string;
    slug: string;
    description: string;
    price: number; // in cents
    images: string[];
    categoryId: string;
    brandId?: string | null;
    stock: number;
    isFeatured?: boolean;
    isActive?: boolean;
  }
) {
  await db.transaction(async (tx) => {
    await tx
      .update(products)
      .set({
        name: input.name,
        slug: input.slug,
        description: input.description,
        price: input.price,
        images: input.images,
        categoryId: input.categoryId,
        brandId: input.brandId || null,
        isFeatured: input.isFeatured ?? false,
        isActive: input.isActive ?? true,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

    await tx
      .update(inventory)
      .set({
        stock: input.stock,
        updatedAt: new Date(),
      })
      .where(eq(inventory.productId, id));
  });
}

export async function deleteProduct(id: string) {
  // Cascades to inventory automatically via database foreign key constraint
  await db.delete(products).where(eq(products.id, id));
}

// --- Storefront Catalog Services ---

export async function getStorefrontProducts(filters: {
  search?: string;
  categorySlugs?: string[];
  brandSlugs?: string[];
  minPrice?: number; /* in cents */
  maxPrice?: number; /* in cents */
  sort?: string;
}) {
  const whereClauses: any[] = [eq(products.isActive, true)];

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

  if (filters.brandSlugs && filters.brandSlugs.length > 0) {
    whereClauses.push(inArray(brands.slug, filters.brandSlugs));
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
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
      brand: {
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
      },
      stock: inventory.stock,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(inventory, eq(products.id, inventory.productId))
    .where(and(...whereClauses))
    .orderBy(order);
}

export async function getProductBySlug(slug: string) {
  const results = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      images: products.images,
      isFeatured: products.isFeatured,
      isActive: products.isActive,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
      brand: {
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
      },
      stock: inventory.stock,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(inventory, eq(products.id, inventory.productId))
    .where(eq(products.slug, slug))
    .limit(1);
  return results[0] || null;
}
