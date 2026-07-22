"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteProductButton from "./DeleteProductButton";
import { toggleProductActiveAction, toggleProductFeaturedAction } from "@/app/actions/catalog";
import { useModal } from "@/components/providers/modal-provider";

export interface ProductTableItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; /* in cents */
  images: string[];
  videos?: string[];
  isFeatured: boolean;
  isActive: boolean;
  stock: number | null;
  category: {
    id: string;
    name: string;
  } | null;
}

export default function ProductTableControls({ products }: { products: ProductTableItem[] }) {
  const router = useRouter();
  const { notice } = useModal();
  const [filterTab, setFilterTab] = useState<"all" | "active" | "hidden" | "featured">("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const activeFeaturedCount = products.filter((p) => p.isFeatured && p.isActive).length;

  const filteredProducts = products.filter((p) => {
    if (filterTab === "active") return p.isActive;
    if (filterTab === "hidden") return !p.isActive;
    if (filterTab === "featured") return p.isFeatured;
    return true;
  });

  async function handleToggleActive(id: string, currentActive: boolean) {
    setTogglingId(id);
    const res = await toggleProductActiveAction(id, !currentActive);
    setTogglingId(null);
    if (res?.error) {
      notice({
        title: "Error",
        message: res.error,
        cancelText: "Close",
      });
    } else {
      router.refresh();
    }
  }

  async function handleToggleFeatured(id: string, currentFeatured: boolean) {
    setTogglingId(id);
    const res = await toggleProductFeaturedAction(id, !currentFeatured);
    setTogglingId(null);
    if (res?.error) {
      notice({
        title: "Featured Quota Full",
        message: res.error,
        cancelText: "Got it",
      });
    } else {
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar with Count Badge */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-lightest-pink pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-ink">Manage Products</h2>
          <span className="text-xs font-bold text-dark-pink bg-lightest-pink px-3 py-1 rounded-full border border-light-pink">
            Featured: {activeFeaturedCount} / 6
          </span>
        </div>

        <Link
          href="/admin/products/new"
          className="h-10 inline-flex items-center justify-center rounded-full bg-primary px-6 text-xs font-bold text-on-primary hover:bg-dark-pink transition-all duration-300 ease-out shadow-sm hover:scale-105 active:scale-95"
        >
          + Add Product
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-light-pink/40 pb-2">
        <button
          type="button"
          onClick={() => setFilterTab("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterTab === "all"
              ? "bg-dark-pink text-white shadow-sm"
              : "text-steel hover:bg-lightest-pink/60"
          }`}
        >
          All ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab("active")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterTab === "active"
              ? "bg-dark-pink text-white shadow-sm"
              : "text-steel hover:bg-lightest-pink/60"
          }`}
        >
          Visible ({products.filter((p) => p.isActive).length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab("hidden")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterTab === "hidden"
              ? "bg-dark-pink text-white shadow-sm"
              : "text-steel hover:bg-lightest-pink/60"
          }`}
        >
          Hidden ({products.filter((p) => !p.isActive).length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab("featured")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterTab === "featured"
              ? "bg-dark-pink text-white shadow-sm"
              : "text-steel hover:bg-lightest-pink/60"
          }`}
        >
          Featured ★ ({products.filter((p) => p.isFeatured).length})
        </button>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 border border-light-pink/60 rounded-2xl bg-canvas">
          <p className="text-sm font-medium text-steel">No products found in this filter view.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-light-pink bg-canvas shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-light-pink bg-lightest-pink/20 uppercase tracking-wider text-stone font-semibold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-pink/40 text-ink font-medium">
              {filteredProducts.map((product) => {
                const coverImage = product.images[0] || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300&auto=format&fit=crop";
                const isToggling = togglingId === product.id;

                return (
                  <tr key={product.id} className="hover:bg-lightest-pink/10 transition-colors">
                    {/* Product Name & Cover Thumbnail */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-light-pink bg-white flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={coverImage} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-ink block leading-snug">{product.name}</span>
                          <span className="text-[11px] text-stone font-normal font-mono">{product.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-steel">
                      {product.category?.name || "Uncategorized"}
                    </td>

                    {/* Price in Taka */}
                    <td className="p-4 font-bold text-ink">
                      ৳ {(product.price / 100).toLocaleString("en-BD", { minimumFractionDigits: 0 })}
                    </td>

                    {/* Stock */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        (product.stock || 0) > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        {(product.stock || 0) > 0 ? `${product.stock} in stock` : "Out of Stock"}
                      </span>
                    </td>

                    {/* Featured Toggle Switch */}
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                        disabled={isToggling || !product.isActive}
                        title={!product.isActive ? "This product is hidden. Make it visible to add to featured products." : ""}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                          !product.isActive
                            ? "bg-gray-100 border-gray-200 text-gray-400 opacity-60 cursor-not-allowed select-none"
                            : product.isFeatured
                              ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200 cursor-pointer"
                              : "bg-stone/10 border-stone/20 text-stone hover:bg-stone/20 cursor-pointer"
                        }`}
                      >
                        {product.isFeatured ? "★ Featured" : "☆ Normal"}
                      </button>
                    </td>

                    {/* Visibility Toggle Switch */}
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(product.id, product.isActive)}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                          product.isActive
                            ? "bg-emerald-100 border-emerald-300 text-emerald-900 hover:bg-emerald-200"
                            : "bg-red-100 border-red-300 text-red-900 hover:bg-red-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? "bg-emerald-600" : "bg-red-600"}`} />
                        {product.isActive ? "Visible" : "Hidden"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs font-semibold text-dark-pink hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={product.id} title={product.name} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
