"use client";

import { useState } from "react";
import { createBrandAction } from "@/app/actions/catalog";

export default function BrandForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const result = await createBrandAction(null, formData);

    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      (event.target as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-full border border-light-pink p-6 rounded-2xl bg-canvas">
      <h3 className="text-md font-semibold text-ink">Add New Brand</h3>

      <div>
        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          placeholder="e.g. Imphal Handloom"
          className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
          Slug
        </label>
        <input
          type="text"
          name="slug"
          id="slug"
          required
          placeholder="e.g. imphal-handloom"
          className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="logoUrl" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
          Logo URL (Optional)
        </label>
        <input
          type="text"
          name="logoUrl"
          id="logoUrl"
          placeholder="e.g. /uploads/logo.jpg"
          className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          placeholder="Describe this brand..."
          className="w-full p-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none resize-none"
        />
      </div>

      {error && <p className="text-xs text-brand-red-dark font-medium">{error}</p>}
      {success && <p className="text-xs text-success-accent font-medium">Brand created successfully!</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-10 inline-flex items-center justify-center rounded-full bg-primary text-xs font-medium text-on-primary hover:bg-dark-pink disabled:bg-stone disabled:cursor-not-allowed transition-colors"
      >
        {pending ? "Creating..." : "Create Brand"}
      </button>
    </form>
  );
}
