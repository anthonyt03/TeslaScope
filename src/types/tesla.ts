export type TeslaModel = "m3" | "my" | "ms" | "mx" | "ct";
export type VehicleCondition = "new" | "used";

export interface TeslaVehicle {
  VIN: string;
  Model: TeslaModel;
  TrimName: string;
  Year: number;
  Price: number;
  Odometer: number;
  OdometerType: string;
  IsDemo: boolean;
  IsNew: boolean;
  TitleStatus: string;
  City: string;
  StateProvince: string;
  CountryCode: string;
  CompositorViews?: {
    frontView?: string;
  };
  PAINT?: string[];
  INTERIOR?: string[];
  WHEELS?: string[];
  ADL_OPTS?: string[];
  InventoryPrice?: number;
  ActualGAIncentives?: number;
  TotalSavings?: number;
  Range?: number;
  ChargePort?: string;
  Autopilot?: string[];
  DisplayName?: string;
  OptionCodeSpecs?: {
    C_OPTS?: {
      code: string;
      name: string;
      description?: string;
    }[];
  };
}

export interface TeslaInventoryResponse {
  results: TeslaVehicle[];
  total_matches_found: number;
  exact_matches_found: number;
}

export interface InventoryFilters {
  model: TeslaModel | "all";
  condition: VehicleCondition | "all";
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
}

export type SortOption =
  | "price_asc"
  | "price_desc"
  | "year_asc"
  | "year_desc"
  | "odometer_asc"
  | "odometer_desc";

export const MODEL_LABELS: Record<TeslaModel | "all", string> = {
  all: "All Models",
  m3: "Model 3",
  my: "Model Y",
  ms: "Model S",
  mx: "Model X",
  ct: "Cybertruck",
};

export const SORT_LABELS: Record<SortOption, string> = {
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  year_asc: "Year: Oldest First",
  year_desc: "Year: Newest First",
  odometer_asc: "Mileage: Low to High",
  odometer_desc: "Mileage: High to Low",
};
