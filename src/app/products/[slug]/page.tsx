import { getProductBySlug } from "@/services/catalog";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/storefront/ProductGallery";
import Link from "next/link";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { trackServerEvent } from "@/services/posthog";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | TraDiva",
    };
  }

  return {
    title: `${product.name} | TraDiva Traditional Manipuri Attire`,
    description: product.description.substring(0, 155) + "...",
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Track product view in PostHog
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id || "anonymous_customer";
  trackServerEvent(userId, "storefront_view_product", {
    productId: product.id,
    name: product.name,
    category: product.category.name,
    price: product.price,
  });

  const isOutOfStock = !product.stock || product.stock === 0;
  const isLowStock = product.stock !== null && product.stock > 0 && product.stock <= 5;

  // JSON-LD Product Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": (product.price / 100).toFixed(2),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": isOutOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <div className="bg-canvas py-12 px-6 md:px-8">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold uppercase tracking-wider text-stone mb-8">
          <Link href="/catalog" className="hover:text-dark-pink transition-colors">
            Catalog
          </Link>{" "}
          / <span className="text-dark-pink">{product.category.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Gallery Column */}
          <div className="md:col-span-6 lg:col-span-5">
            <ProductGallery images={product.images} />
          </div>

          {/* Details Column */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-start">
            {/* Brand Label */}
            <span className="text-xs font-bold uppercase tracking-wider text-dark-pink bg-lightest-pink px-2.5 py-1 rounded-md w-max mb-4">
              {product.brand?.name || "Traditional Weave"}
            </span>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink mb-2">
              {product.name}
            </h1>

            {/* Price */}
            <span className="text-2xl font-bold text-ink mb-6">
              ${(product.price / 100).toFixed(2)}
            </span>

            {/* Inventory Status Banner */}
            <div className="mb-8">
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-red-dark bg-brand-red/20 border border-brand-red/30 px-3.5 py-1.5 rounded-full">
                  🔴 Out of Stock
                </div>
              ) : isLowStock ? (
                <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-red-dark bg-brand-red/20 border border-brand-red/30 px-3.5 py-1.5 rounded-full">
                  ⚠️ Low Stock: Only {product.stock} items left!
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-xs font-bold text-success-accent bg-success-accent/10 border border-success-accent/20 px-3.5 py-1.5 rounded-full">
                  🟢 In Stock & Ready to Ship
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-lightest-pink pt-6 mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone mb-3">
                Description & Craft details
              </h3>
              <div className="text-sm text-steel leading-relaxed whitespace-pre-line space-y-4">
                {product.description}
              </div>
            </div>

            {/* Mock Checkout Action Button */}
            <div className="pt-6 border-t border-lightest-pink">
              <button
                disabled={isOutOfStock}
                className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-full bg-primary px-10 text-sm font-semibold text-on-primary hover:bg-dark-pink disabled:bg-stone disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
