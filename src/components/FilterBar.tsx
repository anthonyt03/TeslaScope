"use client";

import { InventoryFilters, MODEL_LABELS, SORT_LABELS, SortOption, TeslaModel, VehicleCondition } from "@/types/tesla";

interface FilterBarProps {
  filters: InventoryFilters;
  onChange: (filters: InventoryFilters) => void;
  total: number;
  loading: boolean;
}

const MODELS: (TeslaModel | "all")[] = ["all", "m3", "my", "ms", "mx", "ct"];
const CONDITIONS: { value: VehicleCondition | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
];
const SORT_OPTIONS = Object.entries(SORT_LABELS) as [SortOption, string][];

export default function FilterBar({ filters, onChange, total, loading }: FilterBarProps) {
  function update(partial: Partial<InventoryFilters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Model Tabs */}
        <div className="flex gap-2 flex-wrap mb-4">
          {MODELS.map((model) => (
            <button
              key={model}
              onClick={() => update({ model })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.model === model
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {MODEL_LABELS[model]}
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Condition */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {CONDITIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => update({ condition: value })}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  filters.condition === value
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Price:</span>
            <input
              type="number"
              min={0}
              max={filters.maxPrice}
              step={1000}
              value={filters.minPrice || ""}
              onChange={(e) => update({ minPrice: Number(e.target.value) || 0 })}
              placeholder="Min"
              className="w-28 px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-red-400"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              min={filters.minPrice}
              step={1000}
              value={filters.maxPrice || ""}
              onChange={(e) => update({ maxPrice: Number(e.target.value) || 0 })}
              placeholder="Max"
              className="w-28 px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-red-400"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-500 dark:text-gray-400">Sort:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => update({ sortBy: e.target.value as SortOption })}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-red-400"
            >
              {SORT_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Result count */}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {loading ? "Loading…" : `${total} vehicle${total !== 1 ? "s" : ""}`}
          </span>
        </div>
      </div>
    </div>
  );
}
