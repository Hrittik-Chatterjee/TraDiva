import { getBrands } from "@/services/catalog";
import BrandForm from "@/components/admin/BrandForm";
import DeleteBrandButton from "@/components/admin/DeleteBrandButton";

export default async function AdminBrandsPage() {
  const brandsList = await getBrands();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium tracking-tight">Manage Brands</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        {/* Brand List */}
        <div className="flex-1 min-w-0 overflow-x-auto rounded-2xl border border-light-pink bg-canvas">
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
              {brandsList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-stone">
                    No brands found. Create one on the right to get started.
                  </td>
                </tr>
              ) : (
                brandsList.map((brand) => (
                  <tr key={brand.id} className="hover:bg-lightest-pink/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {brand.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="w-8 h-8 rounded-full border border-light-pink object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full border border-light-pink bg-lightest-pink/20 flex items-center justify-center font-bold text-xs text-dark-pink">
                            {brand.name[0]}
                          </div>
                        )}
                        <span className="font-semibold">{brand.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs">{brand.slug}</td>
                    <td className="p-4 text-stone truncate max-w-[200px]" title={brand.description || ""}>
                      {brand.description || "-"}
                    </td>
                    <td className="p-4 text-right">
                      <DeleteBrandButton id={brand.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create Brand Form */}
        <div className="w-full lg:w-1/3 shrink-0">
          <BrandForm />
        </div>
      </div>
    </div>
  );
}
