import { getVehicles } from "@/lib/db";
import FeaturedVehiclesGrid from "@/components/home/FeaturedVehiclesGrid";

export default async function FeaturedVehicles() {
  const vehicles = (await getVehicles()).slice(0, 6);

  return <FeaturedVehiclesGrid vehicles={vehicles} />;
}
