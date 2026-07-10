import { getStorefrontProducts, getCategories, getBrands } from "@/services/catalog";
import CatalogFilters from "@/components/storefront/CatalogFilters";
import Link from "next/link";

interface CatalogPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await searchParams;

  const categorySlugs = resolvedSearchParams.category ? resolvedSearchParams.category.split(",") : undefined;
  const brandSlugs = resolvedSearchParams.brand ? resolvedSearchParams.brand.split(",") : undefined;

  const [productsList, categoriesList, brandsList] = await Promise.all([
    getStorefrontProducts({
      search: resolvedSearchParams.q,
      categorySlugs,
      brandSlugs,
      sort: resolvedSearchParams.sort,
    }),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="bg-canvas py-12 px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-12 border-b border-lightest-pink pb-8">
          <h1 className="text-4xl font-medium tracking-tight mb-2">Heritage Collection</h1>
          <p className="text-steel text-sm max-w-[448px]">
            Woven by hand, worn with pride. Explore traditional Manipuri apparel and cultural ornaments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24">
            <CatalogFilters categories={categoriesList} brands={brandsList} />
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {productsList.length === 0 ? (
              <div className="text-center p-16 border border-dashed border-light-pink rounded-3xl bg-lightest-pink/5">
                <span className="text-4xl block mb-4">🌸</span>
                <h3 className="text-lg font-bold text-ink mb-1">No products found</h3>
                <p className="text-stone text-xs max-w-[320px] mx-auto">
                  We couldn&apos;t find any items matching your filters. Try clearing some selections!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {productsList.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Thumbnail Container */}
                      <div className="relative aspect-[4/5] w-full rounded-2xl border border-light-pink bg-lightest-pink/10 overflow-hidden mb-4">
                        {product.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl bg-lightest-pink/20">
                            👗
                          </div>
                        )}
                        {/* Out of Stock Overlay */}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-canvas/60 flex items-center justify-center">
                            <span className="text-xs font-bold text-dark-pink uppercase tracking-widest bg-canvas border border-light-pink px-3 py-1 rounded-full">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Brand Label */}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-dark-pink">
                        {product.brand?.name || "Traditional Weave"}
                      </span>

                      {/* Title */}
                      <h3 className="font-semibold text-ink text-sm group-hover:text-dark-pink transition-colors mt-1">
                        {product.name}
                      </h3>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-ink">${(product.price / 100).toFixed(2)}</span>
                      <span className="text-xs font-medium text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
