import { getProducts } from "@/services/catalog";
import ProductTableControls from "@/components/admin/ProductTableControls";

export default async function AdminProductsPage() {
  const productsList = await getProducts();

  return (
    <div className="space-y-6">
      <ProductTableControls products={productsList} />
    </div>
  );
}
