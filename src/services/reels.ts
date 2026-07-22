import { db } from "../../db";
import { reels } from "../../db/schema";
import { eq, asc, desc } from "drizzle-orm";

export interface ReelItem {
  id: string;
  title: string;
  tagline: string;
  imageUrl: string;
  videoUrl: string;
  categorySlug: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export async function getStorefrontReels(): Promise<ReelItem[]> {
  return await db
    .select()
    .from(reels)
    .where(eq(reels.isActive, true))
    .orderBy(asc(reels.sortOrder), desc(reels.createdAt))
    .limit(6);
}

export async function getAllAdminReels(): Promise<ReelItem[]> {
  return await db
    .select()
    .from(reels)
    .orderBy(asc(reels.sortOrder), desc(reels.createdAt));
}

export async function createReel(input: {
  title: string;
  tagline: string;
  imageUrl: string;
  videoUrl: string;
  categorySlug: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const activeCount = await db
    .select()
    .from(reels)
    .where(eq(reels.isActive, true));

  if (input.isActive !== false && activeCount.length >= 6) {
    throw new Error("Maximum limit of 6 active reels reached. Please deactivate or delete an existing reel.");
  }

  const id = "reel_" + crypto.randomUUID();
  await db.insert(reels).values({
    id,
    title: input.title,
    tagline: input.tagline,
    imageUrl: input.imageUrl,
    videoUrl: input.videoUrl,
    categorySlug: input.categorySlug || "saree",
    sortOrder: input.sortOrder ?? activeCount.length,
    isActive: input.isActive ?? true,
  });

  return id;
}

export async function updateReel(
  id: string,
  input: {
    title: string;
    tagline: string;
    imageUrl: string;
    videoUrl: string;
    categorySlug: string;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  if (input.isActive) {
    const activeReels = await db
      .select()
      .from(reels)
      .where(eq(reels.isActive, true));
    const isOtherActive = activeReels.filter((r) => r.id !== id);
    if (isOtherActive.length >= 6) {
      throw new Error("Maximum limit of 6 active reels reached. Please deactivate or delete an existing reel.");
    }
  }

  await db
    .update(reels)
    .set({
      title: input.title,
      tagline: input.tagline,
      imageUrl: input.imageUrl,
      videoUrl: input.videoUrl,
      categorySlug: input.categorySlug,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
      updatedAt: new Date(),
    })
    .where(eq(reels.id, id));
}

export async function deleteReel(id: string) {
  await db.delete(reels).where(eq(reels.id, id));
}
