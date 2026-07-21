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

const DEFAULT_REELS = [
  {
    title: "TraDiva Silk",
    tagline: "#HandspunLuxury",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
    videoUrl: "/hypedemo.mp4",
    categorySlug: "saree",
    sortOrder: 0,
  },
  {
    title: "Moirang Weaves",
    tagline: "#ArtisanPride",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop",
    videoUrl: "/hypedemo.mp4",
    categorySlug: "innaphi",
    sortOrder: 1,
  },
  {
    title: "Saree Stories",
    tagline: "#CulturalLegacy",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
    videoUrl: "/hypedemo.mp4",
    categorySlug: "saree",
    sortOrder: 2,
  },
  {
    title: "Innaphi Aura",
    tagline: "#ManipuriThreads",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop",
    videoUrl: "/hypedemo.mp4",
    categorySlug: "innaphi",
    sortOrder: 3,
  },
  {
    title: "Heritage Urna",
    tagline: "#ArtistryInEveryWeave",
    imageUrl: "https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=600&auto=format&fit=crop",
    videoUrl: "/hypedemo.mp4",
    categorySlug: "urna",
    sortOrder: 4,
  },
];

// Seed default reels if none exist
export async function ensureDefaultReelsSeeded() {
  const existing = await db.select().from(reels).limit(1);
  if (existing.length === 0) {
    for (const item of DEFAULT_REELS) {
      await db.insert(reels).values({
        id: "reel_" + crypto.randomUUID(),
        ...item,
        isActive: true,
      });
    }
  }
}

export async function getStorefrontReels(): Promise<ReelItem[]> {
  await ensureDefaultReelsSeeded();
  const list = await db
    .select()
    .from(reels)
    .where(eq(reels.isActive, true))
    .orderBy(asc(reels.sortOrder), desc(reels.createdAt))
    .limit(6);

  return list;
}

export async function getAllAdminReels(): Promise<ReelItem[]> {
  await ensureDefaultReelsSeeded();
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
