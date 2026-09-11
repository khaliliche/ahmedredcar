import Hero from "@/components/home/Hero";
import DeliveryBanner from "@/components/home/DeliveryBanner";
import TrustIndicators from "@/components/home/TrustIndicators";
import FeaturedVehiclesGrid from "@/components/home/FeaturedVehiclesGrid";
import TripFinder from "@/components/home/TripFinder";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import AboutSection from "@/components/home/AboutSection";
import Reviews from "@/components/home/Reviews";
import { getVehicles } from "@/lib/db";

export default async function Home() {
  const vehicles = await getVehicles();

  return (
    <main>
      <Hero />
      <DeliveryBanner />
      <TrustIndicators />
      <FeaturedVehiclesGrid vehicles={vehicles.slice(0, 6)} />
      <TripFinder vehicles={vehicles} />
      <HowItWorks />
      <Testimonials />
      <AboutSection />
      <Reviews />
    </main>
  );
}