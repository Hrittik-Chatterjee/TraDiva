"use server";

import { revalidatePath } from "next/cache";
import { createReel, updateReel, deleteReel } from "@/services/reels";
import { reelSchema } from "@/lib/validation/reels";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { trackServerEvent } from "@/services/posthog";

async function getAdminUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.id || "anonymous_admin";
}

export async function createReelAction(input: unknown) {
  const result = reelSchema.safeParse(input);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const id = await createReel(result.data);
    const userId = await getAdminUserId();
    trackServerEvent(userId, "admin_create_reel", { reelId: id, title: result.data.title });
    revalidatePath("/admin/reels");
    revalidatePath("/");
    return { success: true, id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create reel";
    return { error: message };
  }
}

export async function updateReelAction(id: string, input: unknown) {
  const result = reelSchema.safeParse(input);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    await updateReel(id, result.data);
    const userId = await getAdminUserId();
    trackServerEvent(userId, "admin_update_reel", { reelId: id, title: result.data.title });
    revalidatePath("/admin/reels");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update reel";
    return { error: message };
  }
}

export async function deleteReelAction(id: string) {
  try {
    await deleteReel(id);
    const userId = await getAdminUserId();
    trackServerEvent(userId, "admin_delete_reel", { reelId: id });
    revalidatePath("/admin/reels");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Reel delete action error:", error);
    return { error: "Failed to delete reel" };
  }
}
