import { getCategories } from "@/services/catalog";
import CategoryForm from "@/components/admin/CategoryForm";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const categoriesList = await getCategories();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium tracking-tight">Manage Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category List */}
        <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-light-pink bg-canvas">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-light-pink bg-lightest-pink/10 text-xs font-semibold uppercase tracking-wider text-stone">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lightest-pink text-sm text-ink">
              {categoriesList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-stone">
                    No categories found. Create one on the right to get started.
                  </td>
                </tr>
              ) : (
                categoriesList.map((category) => (
                  <tr key={category.id} className="hover:bg-lightest-pink/5 transition-colors">
                    <td className="p-4 font-semibold">{category.name}</td>
                    <td className="p-4 font-mono text-xs">{category.slug}</td>
                    <td className="p-4 text-stone truncate max-w-[200px]" title={category.description || ""}>
                      {category.description || "-"}
                    </td>
                    <td className="p-4 text-right">
                      <DeleteCategoryButton id={category.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create Category Form */}
        <div className="lg:col-span-4">
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}
