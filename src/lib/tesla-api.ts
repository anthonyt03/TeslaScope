import { TeslaInventoryResponse, TeslaModel, VehicleCondition } from "@/types/tesla";

const TESLA_INVENTORY_API =
  "https://www.tesla.com/inventory/api/v4/inventory-results";

export async function fetchTeslaInventory(
  model: TeslaModel,
  condition: VehicleCondition,
  offset = 0,
  count = 50
): Promise<TeslaInventoryResponse> {
  const query = {
    query: {
      model,
      condition,
      options: {},
      arrangeby: "Price",
      order: "asc",
      market: "US",
      language: "en",
      super_region: "north america",
      lng: -95.7129,
      lat: 37.0902,
      zip: "10001",
      range: 0,
      region: "US",
    },
    offset,
    count,
    outsideOffset: 0,
    outsideSearch: false,
  };

  const url = `${TESLA_INVENTORY_API}?query=${encodeURIComponent(JSON.stringify(query))}`;

  const res = await fetch(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Tesla inventory: ${res.status}`);
  }

  return res.json();
}

export async function fetchAllInventory(
  models: TeslaModel[],
  condition: VehicleCondition | "all"
) {
  const conditions: VehicleCondition[] =
    condition === "all" ? ["new", "used"] : [condition];

  const fetches = models.flatMap((model) =>
    conditions.map((cond) =>
      fetchTeslaInventory(model, cond).catch(() => ({
        results: [],
        total_matches_found: 0,
        exact_matches_found: 0,
      }))
    )
  );

  const responses = await Promise.all(fetches);
  return responses.flatMap((r) => r.results);
}
