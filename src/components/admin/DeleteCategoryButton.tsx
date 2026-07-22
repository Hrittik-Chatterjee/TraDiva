"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "@/app/actions/catalog";
import { useModal } from "@/components/providers/modal-provider";

export default function DeleteCategoryButton({ id, title }: { id: string; title?: string }) {
  const router = useRouter();
  const { confirm, notice } = useModal();
  const [pending, setPending] = useState(false);

  function handleClick() {
    confirm({
      title: "Delete Category?",
      message: `Are you sure you want to delete ${title ? `"${title}"` : "this category"}? Products in this category will become uncategorized.`,
      confirmText: "Delete Category",
      cancelText: "Cancel",
      confirmVariant: "danger",
      onConfirm: async () => {
        setPending(true);
        const result = await deleteCategoryAction(id);
        setPending(false);

        if (result?.error) {
          notice({
            title: "Error",
            message: result.error,
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
      onClick={handleClick}
      disabled={pending}
      className="text-xs font-semibold text-brand-red-dark hover:underline disabled:text-stone cursor-pointer"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
