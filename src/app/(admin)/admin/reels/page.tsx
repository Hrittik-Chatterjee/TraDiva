import { getAllAdminReels } from "@/services/reels";
import { getCategories } from "@/services/catalog";
import ReelForm from "@/components/admin/ReelForm";
import DeleteReelButton from "@/components/admin/DeleteReelButton";
import Image from "next/image";

export default async function AdminReelsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; editId?: string }>;
}) {
  const { action, editId } = await searchParams;
  const reels = await getAllAdminReels();
  const categories = await getCategories();

  const activeReelsCount = reels.filter((r) => r.isActive).length;

  // Edit mode
  if (action === "edit" && editId) {
    const reelToEdit = reels.find((r) => r.id === editId);
    if (reelToEdit) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-ink">Edit Reel</h2>
          </div>
          <ReelForm
            initialData={reelToEdit}
            categories={categories}
            currentActiveCount={activeReelsCount}
          />
        </div>
      );
    }
  }

  // Create mode
  if (action === "new") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-ink">Add New Video Reel</h2>
        </div>
        <ReelForm categories={categories} currentActiveCount={activeReelsCount} />
      </div>
    );
  }

  // List mode
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-lightest-pink pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">Video Reels Management</h2>
          <p className="text-xs text-stone mt-1">
            Manage showcase video reels for the storefront homepage hero slider (Maximum 6 active reels allowed).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-dark-pink bg-lightest-pink px-3 py-1.5 rounded-full border border-light-pink">
            Active Reels: {activeReelsCount} / 6
          </span>
          <a
            href={activeReelsCount >= 6 ? "#" : "/admin/reels?action=new"}
            className={`h-10 inline-flex items-center justify-center rounded-full bg-primary px-6 text-xs font-medium text-on-primary hover:bg-dark-pink transition-colors ${
              activeReelsCount >= 6 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            + Add New Reel
          </a>
        </div>
      </div>

      {/* Reels Grid */}
      {reels.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-light-pink rounded-2xl bg-canvas">
          <p className="text-sm font-medium text-stone">No video reels configured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="relative rounded-2xl border border-light-pink bg-canvas overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              {/* Media Preview Container */}
              <div className="relative aspect-[9/16] w-full bg-black">
                {reel.imageUrl ? (
                  <Image
                    src={reel.imageUrl}
                    fill
                    unoptimized
                    className="object-cover"
                    alt={reel.title}
                    sizes="300px"
                  />
                ) : (
                  <video src={reel.videoUrl} className="w-full h-full object-cover" preload="metadata" />
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${
                      reel.isActive
                        ? "bg-emerald-500 text-white border-emerald-600"
                        : "bg-stone/80 text-white border-stone"
                    }`}
                  >
                    {reel.isActive ? "Active" : "Hidden"}
                  </span>
                </div>

                {/* Sort Order Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                    Pos #{reel.sortOrder + 1}
                  </span>
                </div>

                {/* Text Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-lg font-black uppercase text-[#ffea79] tracking-tight leading-tight">
                    {reel.title}
                  </span>
                  <span className="text-xs text-white/90 font-bold mb-1">{reel.tagline}</span>
                  <span className="text-[10px] text-white/70 uppercase tracking-wider">
                    Category: {reel.categorySlug}
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 border-t border-lightest-pink bg-lightest-pink/10 flex items-center justify-between gap-2">
                <a
                  href={`/admin/reels?action=edit&editId=${reel.id}`}
                  className="text-xs font-semibold text-dark-pink hover:underline"
                >
                  Edit Reel
                </a>
                <DeleteReelButton id={reel.id} title={reel.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
