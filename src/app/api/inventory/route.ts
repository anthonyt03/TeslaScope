import { NextRequest, NextResponse } from "next/server";
import { fetchTeslaInventory } from "@/lib/tesla-api";
import { TeslaModel, VehicleCondition } from "@/types/tesla";

const VALID_MODELS: TeslaModel[] = ["m3", "my", "ms", "mx", "ct"];
const VALID_CONDITIONS: VehicleCondition[] = ["new", "used"];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const model = (searchParams.get("model") as TeslaModel) || "my";
  const condition = (searchParams.get("condition") as VehicleCondition) || "used";
  const offset = parseInt(searchParams.get("offset") || "0");
  const count = Math.min(parseInt(searchParams.get("count") || "24"), 50);

  if (!VALID_MODELS.includes(model)) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  if (!VALID_CONDITIONS.includes(condition)) {
    return NextResponse.json({ error: "Invalid condition" }, { status: 400 });
  }

  try {
    const data = await fetchTeslaInventory(model, condition, offset, count);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 502 }
    );
  }
}
