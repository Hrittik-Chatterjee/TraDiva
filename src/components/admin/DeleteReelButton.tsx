"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteReelAction } from "@/app/actions/reels";
import { useModal } from "@/components/providers/modal-provider";

export default function DeleteReelButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const { confirm, notice } = useModal();
  const [pending, setPending] = useState(false);

  function handleClick() {
    confirm({
      title: "Delete Reel?",
      message: `Are you sure you want to delete "${title}"? This video reel will be permanently removed from the storefront.`,
      confirmText: "Delete Reel",
      cancelText: "Cancel",
      confirmVariant: "danger",
      onConfirm: async () => {
        setPending(true);
        const res = await deleteReelAction(id);
        setPending(false);

        if (res.error) {
          notice({
            title: "Error",
            message: res.error,
            cancelText: "Close",
          });
        } else {
          router.refresh();
        }
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-xs font-semibold text-brand-red hover:underline disabled:opacity-50 cursor-pointer"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
