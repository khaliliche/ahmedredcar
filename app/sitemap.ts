import type { MetadataRoute } from "next";
import { vehicles } from "@/data/vehicles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ahmedredcar.com";

  const staticRoutes = ["", "/vehicules"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const vehicleRoutes = vehicles.map((v) => ({
    url: `${base}/vehicules/${v.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...vehicleRoutes];
}