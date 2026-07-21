"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteReelAction } from "@/app/actions/reels";

export default function DeleteReelButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setPending(true);
    const res = await deleteReelAction(id);
    setPending(false);

    if (res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="text-xs font-semibold text-brand-red hover:underline disabled:opacity-50 cursor-pointer"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
