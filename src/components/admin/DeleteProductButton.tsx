"use client";

import { useState } from "react";
import { deleteProductAction } from "@/app/actions/catalog";

export default function DeleteProductButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setPending(true);
    const result = await deleteProductAction(id);
    setPending(false);
    if (result?.error) {
      alert(result.error);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-xs font-semibold text-brand-red-dark hover:underline disabled:text-stone"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
