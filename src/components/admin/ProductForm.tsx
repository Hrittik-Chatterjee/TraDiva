"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/app/actions/catalog";

import { uploadFileWithProgress } from "@/lib/upload-with-progress";

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
  const [imageProgress, setImageProgress] = useState<number | null>(null);
  
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState<number | null>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setImageProgress(0);
    setError(null);

    try {
      const url = await uploadFileWithProgress(files[0], (percent) => {
        setImageProgress(percent);
      });

      setImages((prev) => [...prev, url]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Image upload failed";
      setError(message);
    } finally {
      setUploadingImage(false);
      setImageProgress(null);
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
    setVideoProgress(0);
    setError(null);

    try {
      const url = await uploadFileWithProgress(file, (percent) => {
        setVideoProgress(percent);
      });

      setVideos((prev) => [...prev, url]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Video upload failed";
      setError(message);
    } finally {
      setUploadingVideo(false);
      setVideoProgress(null);
    }
  }

  function setCoverImage(selectedIndex: number) {
    if (selectedIndex === 0) return;
    setImages((prev) => {
      const target = prev[selectedIndex];
      const filtered = prev.filter((_, idx) => idx !== selectedIndex);
      return [target, ...filtered];
    });
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
            Price (Taka ৳)
          </label>
          <input
            type="number"
            step="1"
            id="price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="৳ 0"
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
          Product Images <span className="normal-case text-stone/70 font-normal">(Click 'Set Cover' to choose featured image)</span>
        </label>

        {/* Upload Input Button & Progress Bar */}
        <div className="space-y-3 mb-4">
          <label className="cursor-pointer h-10 inline-flex items-center justify-center rounded-full border border-light-pink bg-lightest-pink/20 px-4 text-xs font-medium text-ink hover:bg-lightest-pink transition-colors">
            {uploadingImage ? `Uploading (${imageProgress ?? 0}%)` : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </label>

          {/* Animated Percentage Progress Bar */}
          {uploadingImage && imageProgress !== null && (
            <div className="w-full max-w-xs space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-dark-pink">
                <span>Uploading Image...</span>
                <span>{imageProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-lightest-pink overflow-hidden">
                <div
                  className="h-full bg-dark-pink transition-all duration-200 ease-out"
                  style={{ width: `${imageProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Preview Grid with Set Cover Action */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-light-pink/50 bg-lightest-pink/5 mb-4">
            {images.map((url, idx) => (
              <div key={idx} className={`relative aspect-square rounded-lg border bg-canvas overflow-hidden group transition-all ${idx === 0 ? "border-2 border-dark-pink shadow-md" : "border-light-pink"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                
                {/* Cover Badge / Selector */}
                {idx === 0 ? (
                  <span className="absolute top-1 left-1 bg-dark-pink text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow">
                    ★ Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCoverImage(idx)}
                    className="absolute top-1 left-1 bg-black/60 hover:bg-dark-pink text-white text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors opacity-90 group-hover:opacity-100 cursor-pointer"
                  >
                    ★ Set Cover
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary/80 hover:bg-dark-pink text-on-primary flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer"
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

        <div className="space-y-3 mb-4">
          <label className="cursor-pointer h-10 inline-flex items-center justify-center rounded-full border border-light-pink bg-lightest-pink/20 px-4 text-xs font-medium text-ink hover:bg-lightest-pink transition-colors">
            {uploadingVideo ? `Uploading Video (${videoProgress ?? 0}%)` : "Upload Video Clip"}
            <input
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={handleVideoUpload}
              disabled={uploadingVideo}
            />
          </label>

          {/* Animated Percentage Progress Bar */}
          {uploadingVideo && videoProgress !== null && (
            <div className="w-full max-w-xs space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-dark-pink">
                <span>Uploading Video...</span>
                <span>{videoProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-lightest-pink overflow-hidden">
                <div
                  className="h-full bg-dark-pink transition-all duration-200 ease-out"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>
          )}
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
            checked={isActive}
            onChange={(e) => {
              const nextActive = e.target.checked;
              setIsActive(nextActive);
              if (!nextActive) {
                setIsFeatured(false);
              }
            }}
            className="w-4 h-4 rounded border-light-pink accent-dark-pink"
          />
          <span className="text-sm font-medium text-ink">Visible to Customers</span>
        </label>

        <label className={`flex items-center gap-2 select-none ${!isActive ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            checked={isActive && isFeatured}
            disabled={!isActive}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-light-pink accent-dark-pink disabled:cursor-not-allowed"
          />
          <span className="text-sm font-medium text-ink">Feature on Homepage</span>
          {!isActive && (
            <span className="text-[10px] text-stone italic">(Hidden items cannot be featured)</span>
          )}
        </label>
      </div>

      {error && <p className="text-xs text-brand-red-dark font-medium">{error}</p>}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-lightest-pink">
        <button
          type="submit"
          disabled={pending || uploadingImage || uploadingVideo}
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
