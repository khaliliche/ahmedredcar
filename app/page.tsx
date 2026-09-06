import Hero from "@/components/home/Hero";
import TrustIndicators from "@/components/home/TrustIndicators";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import TripFinder from "@/components/home/TripFinder";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustIndicators />
      <FeaturedVehicles />
      <TripFinder />
      <HowItWorks />
      <Testimonials />
      <AboutSection />
      <ContactSection />
    </main>
  );
}