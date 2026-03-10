import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeslaScope – Tesla Inventory Aggregator",
  description:
    "Search, sort, and discover new and used Tesla vehicles in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
