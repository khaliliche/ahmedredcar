﻿import Hero from "@/components/home/Hero";
import TrustIndicators from "@/components/home/TrustIndicators";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import TripFinder from "@/components/home/TripFinder";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import AboutSection from "@/components/home/AboutSection";
import { getVehicles } from "@/lib/db";

export default async function Home() {
  const vehicles = await getVehicles();

  return (
    <main>
      <Hero />
      <TrustIndicators />
      <FeaturedVehicles />
      <TripFinder vehicles={vehicles} />
      <HowItWorks />
      <Testimonials />
      <AboutSection />
    </main>
  );
}