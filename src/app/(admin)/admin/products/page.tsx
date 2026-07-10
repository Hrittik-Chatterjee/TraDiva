import { getProducts } from "@/services/catalog";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const productsList = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium tracking-tight">Manage Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-xs font-medium text-on-primary hover:bg-dark-pink transition-colors"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-light-pink bg-canvas">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-light-pink bg-lightest-pink/10 text-xs font-semibold uppercase tracking-wider text-stone">
              <th className="p-4">Product</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Category</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lightest-pink text-sm text-ink">
            {productsList.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-stone">
                  No products found. Click &quot;Add Product&quot; to publish your first design!
                </td>
              </tr>
            ) : (
              productsList.map((product) => (
                <tr key={product.id} className="hover:bg-lightest-pink/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg border border-light-pink object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg border border-light-pink bg-lightest-pink/20 flex items-center justify-center text-xs font-bold text-dark-pink">
                          👗
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold">{product.name}</span>
                        {product.isFeatured && (
                          <span className="text-[9px] font-bold text-dark-pink uppercase bg-lightest-pink px-1.5 py-0.5 rounded w-max mt-0.5">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs">{product.slug}</td>
                  <td className="p-4 text-stone">{product.category.name}</td>
                  <td className="p-4 text-stone">{product.brand?.name || "-"}</td>
                  <td className="p-4 font-semibold">${(product.price / 100).toFixed(2)}</td>
                  <td className="p-4">
                    {product.stock !== null && product.stock !== undefined ? (
                      product.stock <= 5 ? (
                        <span className="text-xs font-bold text-brand-red-dark bg-brand-red/50 px-2 py-0.5 rounded-full">
                          {product.stock} low
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-stone">{product.stock} units</span>
                      )
                    ) : (
                      <span className="text-xs text-stone">Out of Stock</span>
                    )}
                  </td>
                  <td className="p-4">
                    {product.isActive ? (
                      <span className="text-xs font-semibold text-success-accent bg-success-accent/10 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-stone bg-lightest-pink/30 px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs font-semibold text-brand-blue hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={product.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
