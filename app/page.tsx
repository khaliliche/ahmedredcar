import Hero from "@/components/home/Hero";
import TrustIndicators from "@/components/home/TrustIndicators";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import TripFinder from "@/components/home/TripFinder";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustIndicators />
      <FeaturedVehicles />
      <TripFinder />
    </main>
  );
}
