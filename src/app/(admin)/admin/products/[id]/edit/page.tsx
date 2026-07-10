import { getCategories, getBrands, getProductById } from "@/services/catalog";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    getProductById(id),
    getCategories(),
    getBrands(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight mb-8">Edit Product</h1>
      <ProductForm categories={categories} brands={brands} initialData={product} />
    </div>
  );
}
