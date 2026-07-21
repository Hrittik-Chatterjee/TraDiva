import Hero from "@/components/storefront/Hero";
import Marquee from "@/components/storefront/Marquee";
import CulturalCategories from "@/components/storefront/CulturalCategories";
import BlueprintSection from "@/components/storefront/BlueprintSection";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import NewArrivals from "@/components/storefront/NewArrivals";
import ReelsSection from "@/components/storefront/ReelsSection";
import TestimonialsSection from "@/components/storefront/TestimonialsSection";
import ContactSection from "@/components/storefront/ContactSection";
import { MoirangPheePattern } from "@/components/shared/manipuri-patterns";
import { getStorefrontReels } from "@/services/reels";

export default async function Home() {
  const reels = await getStorefrontReels();

  return (
    <div className="flex flex-col items-center justify-center bg-lightest-pink">
      {/* Hero Section */}
      <Hero />
      <Marquee />
      

      {/* Repeating Traditional Pattern Divider */}
      <MoirangPheePattern height={24} className="bg-lightest-pink my-8" />

      
      {/* Featured Products Showcase Section */}
      <FeaturedProducts />

      {/* Interactive Categories Showcase */}
      <CulturalCategories />

      {/* Artisan Blueprint Showcase Section */}
      <BlueprintSection />

      {/* New Arrivals Showcase Section */}
      <NewArrivals />

      {/* Reels Carousel Showcase Section */}
      <ReelsSection reels={reels} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Us Section */}
      <ContactSection />
    </div>
  );
}
