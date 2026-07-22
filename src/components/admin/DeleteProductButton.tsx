"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProductAction, toggleProductActiveAction } from "@/app/actions/catalog";
import { useModal } from "@/components/providers/modal-provider";

export default function DeleteProductButton({ id, title }: { id: string; title?: string }) {
  const router = useRouter();
  const { confirm, notice, hideModal } = useModal();
  const [pending, setPending] = useState(false);

  function handleClick() {
    confirm({
      title: "Delete Product?",
      message: `Are you sure you want to delete ${title ? `"${title}"` : "this product"}? This action cannot be undone.`,
      confirmText: "Delete Product",
      cancelText: "Keep Product",
      confirmVariant: "danger",
      onConfirm: async () => {
        setPending(true);
        const result = await deleteProductAction(id);
        setPending(false);

        if (result?.error) {
          if (result.isForeignKeyError) {
            notice({
              title: "Cannot Delete Product",
              message: `This product is linked to existing customer orders to preserve purchase records. Would you like to set it to 'Hidden' instead?`,
              actionText: "Hide Product Instead",
              cancelText: "Close",
              onAction: async () => {
                await toggleProductActiveAction(id, false);
                router.refresh();
              },
            });
          } else {
            notice({
              title: "Error",
              message: result.error,
              cancelText: "Close",
            });
          }
        } else {
          hideModal();
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
