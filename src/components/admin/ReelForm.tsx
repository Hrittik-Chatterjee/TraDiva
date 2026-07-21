"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReelAction, updateReelAction } from "@/app/actions/reels";

interface ReelFormProps {
  initialData?: {
    id: string;
    title: string;
    tagline: string;
    imageUrl: string;
    videoUrl: string;
    categorySlug: string;
    sortOrder: number;
    isActive: boolean;
  };
  categories: { id: string; name: string; slug: string }[];
  currentActiveCount: number;
}

export default function ReelForm({ initialData, categories, currentActiveCount }: ReelFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [title, setTitle] = useState(initialData?.title || "");
  const [tagline, setTagline] = useState(initialData?.tagline || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [categorySlug, setCategorySlug] = useState(initialData?.categorySlug || "saree");
  const [sortOrder, setSortOrder] = useState((initialData?.sortOrder ?? currentActiveCount).toString());
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

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
        throw new Error(data.error || "Image upload failed");
      }

      setImageUrl(data.url);
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
      setError("Video clip exceeds 25MB limit. Please upload an optimized MP4 clip under 25MB.");
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
        throw new Error(data.error || "Video upload failed");
      }

      setVideoUrl(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Video upload failed";
      setError(message);
    } finally {
      setUploadingVideo(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) {
      setError("Please upload a cover preview image.");
      return;
    }
    if (!videoUrl) {
      setError("Please upload a video showcase clip.");
      return;
    }

    setPending(true);
    setError(null);

    const payload = {
      title,
      tagline,
      imageUrl,
      videoUrl,
      categorySlug,
      sortOrder: parseInt(sortOrder) || 0,
      isActive,
    };

    let result;
    if (initialData) {
      result = await updateReelAction(initialData.id, payload);
    } else {
      result = await createReelAction(payload);
    }

    setPending(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/admin/reels");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl border border-light-pink p-8 rounded-2xl bg-canvas">
      <div className="flex items-center justify-between border-b border-lightest-pink pb-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">
            {initialData ? "Edit Video Reel" : "Add New Video Reel"}
          </h3>
          <p className="text-xs text-stone mt-0.5">
            Create high-engagement showcase reels for the homepage (Maximum 6 active reels allowed).
          </p>
        </div>
        <span className="text-xs font-bold text-dark-pink bg-lightest-pink px-3 py-1 rounded-full border border-light-pink">
          Active: {currentActiveCount} / 6
        </span>
      </div>

      {/* Grid for Title & Tagline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
            Reel Title / Brand
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. TraDiva Silk"
            className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="tagline" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
            Tagline / Hashtag
          </label>
          <input
            type="text"
            id="tagline"
            required
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. #HandspunLuxury"
            className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
          />
        </div>
      </div>

      {/* Grid for Category Link & Sort Order */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="categorySlug" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
            Shop Link Category
          </label>
          <select
            id="categorySlug"
            required
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-light-pink bg-canvas text-sm focus:border-dark-pink focus:outline-none"
          >
            <option value="all">All Catalog Products</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
            Display Order Position (0-5)
          </label>
          <input
            type="number"
            id="sortOrder"
            required
            min={0}
            max={5}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
          />
        </div>
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone mb-2">
          1. Cover Preview Image <span className="text-brand-red">*</span>
        </label>
        <div className="flex items-center gap-4 mb-3">
          <label className="cursor-pointer h-10 inline-flex items-center justify-center rounded-full border border-light-pink bg-lightest-pink/20 px-4 text-xs font-medium text-ink hover:bg-lightest-pink transition-colors">
            {uploadingImage ? "Uploading Image..." : imageUrl ? "Change Cover Image" : "Upload Cover Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </label>
        </div>

        {imageUrl && (
          <div className="relative w-32 aspect-[9/16] rounded-xl border border-light-pink bg-canvas overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Cover preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Video Clip Upload */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone">
            2. Reel Showcase Video (MP4 / WebM) <span className="text-brand-red">*</span>
          </label>
          <span className="text-[11px] text-stone/70">MP4 under 25MB recommended</span>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <label className="cursor-pointer h-10 inline-flex items-center justify-center rounded-full border border-light-pink bg-lightest-pink/20 px-4 text-xs font-medium text-ink hover:bg-lightest-pink transition-colors">
            {uploadingVideo ? "Uploading Video..." : videoUrl ? "Change Video Clip" : "Upload Video Clip"}
            <input
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={handleVideoUpload}
              disabled={uploadingVideo}
            />
          </label>
        </div>

        {videoUrl && (
          <div className="relative w-48 aspect-[9/16] rounded-xl border border-light-pink bg-black overflow-hidden shadow-sm">
            <video src={videoUrl} controls className="w-full h-full object-cover" preload="metadata" />
          </div>
        )}
      </div>

      {/* Active Flag */}
      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-light-pink accent-dark-pink"
          />
          <span className="text-sm font-medium text-ink">Active on Storefront Homepage</span>
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
          {pending ? "Saving..." : initialData ? "Update Reel" : "Publish Reel"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/reels")}
          className="h-10 inline-flex items-center justify-center rounded-full border border-light-pink bg-transparent px-8 text-xs font-medium text-ink hover:bg-lightest-pink transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
