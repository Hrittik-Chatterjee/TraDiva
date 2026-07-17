import Hero from "@/components/storefront/Hero";
import Marquee from "@/components/storefront/Marquee";
import CulturalCategories from "@/components/storefront/CulturalCategories";
import BlueprintSection from "@/components/storefront/BlueprintSection";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import { MoirangPheePattern } from "@/components/shared/manipuri-patterns";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-canvas">
      {/* Hero Section */}
      <Hero />
      <Marquee />
      

      {/* Repeating Traditional Pattern Divider */}
      <MoirangPheePattern height={24} className="bg-canvas my-8" />

      
      {/* Featured Products Showcase Section */}
      <FeaturedProducts />



      {/* Artisan Blueprint Showcase Section */}
      <BlueprintSection />

            {/* Interactive Categories Showcase */}
      <CulturalCategories />

    </div>
  );
}
