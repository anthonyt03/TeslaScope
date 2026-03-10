"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/FilterBar";
import VehicleCard from "@/components/VehicleCard";
import {
  InventoryFilters,
  TeslaModel,
  TeslaVehicle,
  VehicleCondition,
} from "@/types/tesla";

const ALL_MODELS: TeslaModel[] = ["m3", "my", "ms", "mx", "ct"];
const DEFAULT_FILTERS: InventoryFilters = {
  model: "all",
  condition: "all",
  minPrice: 0,
  maxPrice: 0,
  sortBy: "price_asc",
};

function sortVehicles(
  vehicles: TeslaVehicle[],
  sortBy: string
): TeslaVehicle[] {
  return [...vehicles].sort((a, b) => {
    const priceA = a.InventoryPrice ?? a.Price;
    const priceB = b.InventoryPrice ?? b.Price;
    switch (sortBy) {
      case "price_asc":
        return priceA - priceB;
      case "price_desc":
        return priceB - priceA;
      case "year_asc":
        return a.Year - b.Year;
      case "year_desc":
        return b.Year - a.Year;
      case "odometer_asc":
        return a.Odometer - b.Odometer;
      case "odometer_desc":
        return b.Odometer - a.Odometer;
      default:
        return 0;
    }
  });
}

async function fetchInventory(
  model: TeslaModel,
  condition: VehicleCondition
): Promise<TeslaVehicle[]> {
  const params = new URLSearchParams({ model, condition, count: "50" });
  const res = await fetch(`/api/inventory?${params}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? [];
}

export default function InventoryPage() {
  const [allVehicles, setAllVehicles] = useState<TeslaVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InventoryFilters>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const models =
        filters.model === "all" ? ALL_MODELS : [filters.model as TeslaModel];
      const conditions: VehicleCondition[] =
        filters.condition === "all" ? ["new", "used"] : [filters.condition];

      const fetches = models.flatMap((model) =>
        conditions.map((condition) => fetchInventory(model, condition))
      );

      const results = await Promise.all(fetches);
      const vehicles = results.flat();

      // Deduplicate by VIN
      const seen = new Set<string>();
      const unique = vehicles.filter((v) => {
        if (seen.has(v.VIN)) return false;
        seen.add(v.VIN);
        return true;
      });

      setAllVehicles(unique);
    } catch {
      setError("Failed to load inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters.model, filters.condition]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const filtered = useMemo(() => {
    let vehicles = allVehicles;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      vehicles = vehicles.filter(
        (v) =>
          v.TrimName?.toLowerCase().includes(q) ||
          v.VIN?.toLowerCase().includes(q) ||
          v.City?.toLowerCase().includes(q) ||
          v.StateProvince?.toLowerCase().includes(q) ||
          String(v.Year).includes(q)
      );
    }

    // Price filter
    if (filters.minPrice > 0) {
      vehicles = vehicles.filter(
        (v) => (v.InventoryPrice ?? v.Price) >= filters.minPrice
      );
    }
    if (filters.maxPrice > 0) {
      vehicles = vehicles.filter(
        (v) => (v.InventoryPrice ?? v.Price) <= filters.maxPrice
      );
    }

    return sortVehicles(vehicles, filters.sortBy);
  }, [allVehicles, search, filters.minPrice, filters.maxPrice, filters.sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-red-600">TeslaScope</span>
            <span className="hidden sm:block text-sm text-gray-400">
              Real-time Tesla inventory aggregator
            </span>
          </div>
          {/* Search */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search trim, VIN, city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        total={filtered.length}
        loading={loading}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
            <button
              onClick={loadInventory}
              className="ml-3 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No vehicles found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((vehicle) => (
              <VehicleCard key={vehicle.VIN} vehicle={vehicle} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 py-8 text-center text-sm text-gray-400">
        <p>
          TeslaScope is an independent project and is not affiliated with Tesla,
          Inc.
        </p>
        <p className="mt-1">
          Vehicle data is sourced from Tesla&apos;s public inventory API.
        </p>
      </footer>
    </div>
  );
}
