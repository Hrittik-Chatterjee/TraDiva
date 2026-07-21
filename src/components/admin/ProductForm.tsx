"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/app/actions/catalog";

interface ProductFormProps {
  categories: { id: string; name: string }[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number; /* stored in cents */
    images: string[];
    videos?: string[];
    categoryId: string;
    stock: number | null;
    isFeatured: boolean;
    isActive: boolean;
  };
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Form states
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData ? (initialData.price / 100).toString() : "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [stock, setStock] = useState(initialData ? (initialData.stock || 0).toString() : "0");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [videos, setVideos] = useState<string[]>(initialData?.videos || []);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setImages((prev) => [...prev, data.url]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Image upload failed";
      setError(message);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 25 * 1024 * 1024) {
      setError("Video exceeds the 25MB file size limit. Please upload an optimized clip.");
      return;
    }

    setUploadingVideo(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setVideos((prev) => [...prev, data.url]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Video upload failed";
      setError(message);
    } finally {
      setUploadingVideo(false);
    }
  }

  function removeImage(indexToRemove: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function removeVideo(indexToRemove: number) {
    setVideos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const payload = {
      name,
      slug,
      description,
      price: parseFloat(price),
      categoryId,
      stock: parseInt(stock),
      images,
      videos,
      isFeatured,
      isActive,
    };

    let result;
    if (initialData) {
      result = await updateProductAction(initialData.id, payload);
    } else {
      result = await createProductAction(payload);
    }

    setPending(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
  }
      setError(result.error);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl border border-light-pink p-8 rounded-2xl bg-canvas">
      <h3 className="text-lg font-semibold text-ink">{initialData ? "Edit Product" : "Add New Product"}</h3>

      {/* Grid for Name & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Silk Innaphi"
            className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
            URL Slug
          </label>
          <input
            type="text"
            id="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. silk-innaphi"
            className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
          />
        </div>
      </div>

      {/* Grid for Category, Price, Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
            Category
          </label>
          <select
            id="category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-light-pink bg-canvas text-sm focus:border-dark-pink focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
            Price (USD)
          </label>
          <input
            type="number"
            step="0.01"
            id="price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
            Initial Stock
          </label>
          <input
            type="number"
            id="stock"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
            className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the fabric weave, cultural motif details, sizing..."
          className="w-full p-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none resize-none"
        />
      </div>

      {/* Images Upload */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone mb-2">
          Product Images
        </label>

        {/* Upload Input Button */}
        <div className="flex items-center gap-4 mb-4">
          <label className="cursor-pointer h-10 inline-flex items-center justify-center rounded-full border border-light-pink bg-lightest-pink/20 px-4 text-xs font-medium text-ink hover:bg-lightest-pink transition-colors">
            {uploadingImage ? "Uploading Image..." : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </label>
        </div>

        {/* Thumbnail Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-light-pink/50 bg-lightest-pink/5 mb-4">
            {images.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg border border-light-pink bg-canvas overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary/80 hover:bg-dark-pink text-on-primary flex items-center justify-center text-[10px] font-bold transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Videos Upload (Optional) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone">
            Product Videos <span className="normal-case text-stone/70 font-normal">(Optional)</span>
          </label>
          <span className="text-[11px] text-stone/70">MP4 / WebM under 25MB recommended</span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <label className="cursor-pointer h-10 inline-flex items-center justify-center rounded-full border border-light-pink bg-lightest-pink/20 px-4 text-xs font-medium text-ink hover:bg-lightest-pink transition-colors">
            {uploadingVideo ? "Uploading Video..." : "Upload Video Clip"}
            <input
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={handleVideoUpload}
              disabled={uploadingVideo}
            />
          </label>
        </div>

        {/* Video Preview Grid */}
        {videos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl border border-light-pink/50 bg-lightest-pink/5">
            {videos.map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-lg border border-light-pink bg-black overflow-hidden group">
                <video src={url} controls className="w-full h-full object-contain" preload="metadata" />
                <button
                  type="button"
                  onClick={() => removeVideo(idx)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-bold shadow-md hover:bg-brand-red-dark transition-colors z-10"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature & Active Flags */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-light-pink accent-dark-pink"
          />
          <span className="text-sm font-medium text-ink">Feature on Homepage</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-light-pink accent-dark-pink"
          />
          <span className="text-sm font-medium text-ink">Visible to Customers</span>
        </label>
      </div>

      {error && <p className="text-xs text-brand-red-dark font-medium">{error}</p>}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-lightest-pink">
        <button
          type="submit"
          disabled={pending || uploading}
          className="h-10 inline-flex items-center justify-center rounded-full bg-primary px-8 text-xs font-medium text-on-primary hover:bg-dark-pink disabled:bg-stone disabled:cursor-not-allowed transition-colors"
        >
          {pending ? "Saving..." : initialData ? "Update Product" : "Publish Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="h-10 inline-flex items-center justify-center rounded-full border border-light-pink bg-transparent px-8 text-xs font-medium text-ink hover:bg-lightest-pink transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
