import Hero from "@/components/storefront/Hero";
import Marquee from "@/components/storefront/Marquee";
import { MoirangPheePattern } from "@/components/shared/manipuri-patterns";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-canvas">
      {/* Hero Section */}
      <Hero />
      <Marquee />

      {/* Repeating Traditional Pattern Divider */}
      <MoirangPheePattern height={24} className="bg-canvas my-8" />

      {/* Featured Categories / Cultural Highlights */}
      <section className="page-container py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium text-ink mb-3">Shop Cultural Masterpieces</h2>
          <p className="text-steel max-w-112 mx-auto text-sm">Every garment carries centuries of traditional motifs and spiritual weaving heritage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Phanek */}
          <div className="group rounded-2xl border border-light-pink bg-canvas p-6 flex flex-col justify-between aspect-4/3 hover:border-dark-pink hover:bg-lightest-pink/20 transition-all cursor-pointer">
            <div>
              <span className="text-xs font-bold text-dark-pink uppercase tracking-widest bg-lightest-pink px-2.5 py-1 rounded">Phanek</span>
              <h3 className="text-xl font-semibold text-ink mt-3">Striped Phanek Maphal</h3>
              <p className="text-stone text-xs mt-1">Traditional wrap skirts woven in pure mulberry silk with signature borders.</p>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-lightest-pink group-hover:border-light-pink transition-all">
              <span className="text-xs font-semibold text-brand-blue group-hover:underline">View Designs &rarr;</span>
              <span className="text-xs font-bold text-ink">From $89</span>
            </div>
          </div>

          {/* Card 2: Innaphi */}
          <div className="group rounded-2xl border border-light-pink bg-canvas p-6 flex flex-col justify-between aspect-4/3 hover:border-dark-pink hover:bg-lightest-pink/20 transition-all cursor-pointer">
            <div>
              <span className="text-xs font-bold text-dark-pink uppercase tracking-widest bg-lightest-pink px-2.5 py-1 rounded">Innaphi</span>
              <h3 className="text-xl font-semibold text-ink mt-3">Moirang Phee Shawls</h3>
              <p className="text-stone text-xs mt-1">Exquisite semi-translucent shawls featuring handwoven temple border motifs.</p>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-lightest-pink group-hover:border-light-pink transition-all">
              <span className="text-xs font-semibold text-brand-blue group-hover:underline">View Designs &rarr;</span>
              <span className="text-xs font-bold text-ink">From $120</span>
            </div>
          </div>

          {/* Card 3: Headgear & Accessories */}
          <div className="group rounded-2xl border border-light-pink bg-canvas p-6 flex flex-col justify-between aspect-4/3 hover:border-dark-pink hover:bg-lightest-pink/20 transition-all cursor-pointer">
            <div>
              <span className="text-xs font-bold text-dark-pink uppercase tracking-widest bg-lightest-pink px-2.5 py-1 rounded">Accessories</span>
              <h3 className="text-xl font-semibold text-ink mt-3">Kajenglei & Bridal Ornaments</h3>
              <p className="text-stone text-xs mt-1">Bridal circular crowns, necklaces, and traditional jewelry sets.</p>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-lightest-pink group-hover:border-light-pink transition-all">
              <span className="text-xs font-semibold text-brand-blue group-hover:underline">View Designs &rarr;</span>
              <span className="text-xs font-bold text-ink">From $45</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
