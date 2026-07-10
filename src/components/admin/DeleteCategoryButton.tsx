"use client";

import { useState } from "react";
import { deleteCategoryAction } from "@/app/actions/catalog";

export default function DeleteCategoryButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setPending(true);
    const result = await deleteCategoryAction(id);
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
