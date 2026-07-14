import Link from "next/link";
import { MoirangPheePattern, ManipuriGirlPlaceholder } from "../shared/manipuri-patterns";

export default function Footer() {
  return (
    <>
      <MoirangPheePattern height={16} className="bg-canvas" />
      <footer className="w-full bg-footer-bg text-on-dark py-16 px-6 md:px-8 mt-auto">
        <div className="mx-auto max-w-7xl">
          {/* Main 6-Column Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            {/* Col 1: Shop */}
            <div>
              <h4 className="text-sm font-semibold text-on-dark mb-4">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/catalog" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?featured=true" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                    Featured Collection
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Categories */}
            <div>
              <h4 className="text-sm font-semibold text-on-dark mb-4">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/catalog?category=phanek" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                    Phanek Wrap Skirts
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?category=inaphi" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                    Inaphi Shawls
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Customer Care */}
            <div>
              <h4 className="text-sm font-semibold text-on-dark mb-4">Customer Care</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors cursor-not-allowed">
                    FAQs (Static)
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors cursor-not-allowed">
                    Support Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors cursor-not-allowed">
                    Returns & Refunds
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Company */}
            <div>
              <h4 className="text-sm font-semibold text-on-dark mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors cursor-not-allowed">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors cursor-not-allowed">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors cursor-not-allowed">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 5: Legal */}
            <div>
              <h4 className="text-sm font-semibold text-on-dark mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors cursor-not-allowed">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors cursor-not-allowed">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 6: Cultural Character Column */}
            <div>
              <h4 className="text-sm font-semibold text-on-dark mb-4">TraDiva Weaves</h4>
              <div className="flex flex-col gap-3">
                <div className="h-28 w-24 bg-white/5 rounded-2xl p-2 border border-white/10 flex items-center justify-center overflow-hidden">
                  <ManipuriGirlPlaceholder />
                </div>
                <p className="text-[10px] text-on-dark-muted leading-normal">
                  Woven by hand, worn with pride. Preserving traditional heritage.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-charcoal flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-dark-muted">
            <span>&copy; {new Date().getFullYear()} TraDiva Inc. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:text-on-dark transition-colors cursor-pointer">Facebook</span>
              <span className="hover:text-on-dark transition-colors cursor-pointer">Twitter</span>
              <span className="hover:text-on-dark transition-colors cursor-pointer">Instagram</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
