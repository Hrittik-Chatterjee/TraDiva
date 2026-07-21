import { z } from "zod";

export const reelSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  tagline: z.string().min(2, "Tagline must be at least 2 characters"),
  imageUrl: z.string().min(1, "Cover image is required"),
  videoUrl: z.string().min(1, "Video clip is required"),
  categorySlug: z.string().default("saree"),
  sortOrder: z.preprocess((val) => Number(val), z.number().int().min(0).default(0)),
  isActive: z.boolean().optional().default(true),
});

export type ReelInput = z.infer<typeof reelSchema>;
