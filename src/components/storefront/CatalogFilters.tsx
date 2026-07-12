"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

interface CatalogFiltersProps {
  categories: { name: string; slug: string }[];
}

export default function CatalogFilters({ categories }: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Active filter values from URL
  const activeCategories = searchParams.get("category")?.split(",") || [];
  const activeSort = searchParams.get("sort") || "newest";
  const activeSearch = searchParams.get("q") || "";

  // Local state for search query to avoid router push on every keystroke
  const [searchVal, setSearchVal] = useState(activeSearch);
  const [prevActiveSearch, setPrevActiveSearch] = useState(activeSearch);

  if (activeSearch !== prevActiveSearch) {
    setSearchVal(activeSearch);
    setPrevActiveSearch(activeSearch);
  }

  function handleFilterToggle(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    let currentList = [...activeCategories];

    if (currentList.includes(slug)) {
      currentList = currentList.filter((s) => s !== slug);
    } else {
      currentList.push(slug);
    }

    if (currentList.length > 0) {
      params.set("category", currentList.join(","));
    } else {
      params.delete("category");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSortChange(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) {
      params.set("q", searchVal.trim());
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function clearAllFilters() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  return (
    <div className="space-y-8 select-none">
      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          placeholder="Search catalog..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full h-11 pl-4 pr-12 rounded-full border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 h-7 w-7 rounded-full bg-primary text-on-primary text-xs hover:bg-dark-pink transition-colors flex items-center justify-center"
        >
          🔍
        </button>
      </form>

      {/* Sorting */}
      <div className="border-b border-lightest-pink pb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone mb-3">
          Sort By
        </label>
        <select
          value={activeSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-light-pink bg-canvas text-sm focus:border-dark-pink focus:outline-none"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="border-b border-lightest-pink pb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone mb-3">
            Categories
          </label>
          <div className="space-y-2">
            {categories.map((c) => (
              <label key={c.slug} className="flex items-center gap-2 cursor-pointer text-sm text-ink">
                <input
                  type="checkbox"
                  checked={activeCategories.includes(c.slug)}
                  onChange={() => handleFilterToggle(c.slug)}
                  className="w-4 h-4 rounded border-light-pink accent-dark-pink"
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Clear Action */}
      {(activeCategories.length > 0 || activeSearch || activeSort !== "newest") && (
        <button
          onClick={clearAllFilters}
          className="text-xs font-semibold text-brand-blue hover:underline"
        >
          Clear All Filters
        </button>
      )}

      {isPending && <span className="text-xs text-stone animate-pulse block">Updating results...</span>}
    </div>
  );
}
