"use client";

import Image from "next/image";
import { TeslaVehicle, MODEL_LABELS, TeslaModel } from "@/types/tesla";

interface VehicleCardProps {
  vehicle: TeslaVehicle;
}

const PAINT_LABELS: Record<string, string> = {
  PMNG: "Midnight Silver",
  PPMR: "Multi-Coat Red",
  PPSR: "Solid Red",
  PPSB: "Deep Blue Metallic",
  PMBL: "Obsidian Black",
  PPSW: "Pearl White",
  PPWH: "Solid White",
  PSW: "Pearl White Multi-Coat",
  PPSB2: "Ultra Blue",
  PMAB: "Abyss Blue",
  PMSS: "Stealth Grey",
};

function getPaintLabel(codes?: string[]): string {
  if (!codes || codes.length === 0) return "Unknown";
  return PAINT_LABELS[codes[0]] ?? codes[0];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatOdometer(miles: number, type: string): string {
  if (miles === 0) return "New";
  const unit = type === "mi" ? "mi" : "km";
  return `${miles.toLocaleString()} ${unit}`;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const modelLabel = MODEL_LABELS[vehicle.Model as TeslaModel] ?? vehicle.Model;
  const price = vehicle.InventoryPrice ?? vehicle.Price;
  const paint = getPaintLabel(vehicle.PAINT);
  const location =
    vehicle.City && vehicle.StateProvince
      ? `${vehicle.City}, ${vehicle.StateProvince}`
      : vehicle.StateProvince ?? vehicle.CountryCode;

  const imageUrl = vehicle.CompositorViews?.frontView
    ? vehicle.CompositorViews.frontView
    : null;

  const teslaLink = `https://www.tesla.com/order/${vehicle.VIN}`;

  return (
    <a
      href={teslaLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-red-400 dark:hover:border-red-500 transition-all duration-200 overflow-hidden"
    >
      {/* Vehicle Image */}
      <div className="relative bg-gray-100 dark:bg-gray-800 h-48 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${vehicle.Year} Tesla ${modelLabel}`}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <svg
              className="w-16 h-16 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zm0 0l2-4 2 4M9 8h1"
              />
            </svg>
            <span className="text-sm">No image</span>
          </div>
        )}
        {/* Condition badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
            vehicle.IsNew
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          }`}
        >
          {vehicle.IsNew ? "New" : "Used"}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
            {vehicle.Year} Tesla {modelLabel}
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {vehicle.TrimName}
        </p>

        <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
          {formatPrice(price)}
          {(vehicle.TotalSavings ?? 0) > 0 && (
            <span className="ml-2 text-sm font-normal text-green-600 dark:text-green-400">
              Save {formatPrice(vehicle.TotalSavings ?? 0)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">🎨</span> {paint}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">📍</span> {location}
          </div>
          {!vehicle.IsNew && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">🛣️</span>{" "}
              {formatOdometer(vehicle.Odometer, vehicle.OdometerType)}
            </div>
          )}
          {vehicle.Range && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">⚡</span> {vehicle.Range} mi range
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-mono">{vehicle.VIN}</span>
          <span className="text-xs font-medium text-red-600 dark:text-red-400 group-hover:underline">
            View on Tesla →
          </span>
        </div>
      </div>
    </a>
  );
}
