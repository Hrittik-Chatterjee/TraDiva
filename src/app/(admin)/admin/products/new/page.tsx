import { getCategories, getBrands } from "@/services/catalog";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight mb-8">Create New Product</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
