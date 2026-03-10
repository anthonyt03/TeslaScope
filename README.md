# TeslaScope

TeslaScope aggregates new and used inventory from Tesla into one unified view, making it easy to search, sort, and discover available vehicles in real time.

## Features

- 🔍 **Real-time inventory** — Fetches live vehicle data from Tesla's public inventory API
- 🚗 **All models** — Model 3, Model Y, Model S, Model X, and Cybertruck
- 🔎 **Search** — Find vehicles by trim name, VIN, city, or state
- 🎛️ **Filters** — Filter by model, new/used condition, and price range
- 📊 **Sort** — Sort by price, year, or mileage (ascending/descending)
- 🌙 **Dark mode** — Supports light and dark themes

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    api/inventory/route.ts   # Proxy API route for Tesla inventory
    layout.tsx               # Root layout
    page.tsx                 # Main inventory page
  components/
    FilterBar.tsx            # Model, condition, price & sort controls
    VehicleCard.tsx          # Individual vehicle listing card
  lib/
    tesla-api.ts             # Tesla inventory API client
  types/
    tesla.ts                 # TypeScript types and constants
```

## Disclaimer

TeslaScope is an independent project and is not affiliated with Tesla, Inc.
Vehicle data is sourced from Tesla's public inventory API.
