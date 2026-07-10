import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-footer-bg text-on-dark py-16 px-6 md:px-8 border-t border-charcoal mt-auto">
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
                  Featured
                </Link>
              </li>
              <li>
                <Link href="/catalog?discount=true" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                  Offers & Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-semibold text-on-dark mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/electronics" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/categories/apparel" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                  Apparel
                </Link>
              </li>
              <li>
                <Link href="/categories/home" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                  Home & Living
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-sm font-semibold text-on-dark mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
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
                <Link href="/about" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
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
                <Link href="/privacy" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 6: App Badges */}
          <div>
            <h4 className="text-sm font-semibold text-on-dark mb-4">Get Our App</h4>
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 rounded-md bg-canvas px-4 py-2 text-primary font-semibold text-xs border border-hairline select-none cursor-pointer">
                App Store
              </div>
              <div className="inline-flex items-center gap-2 rounded-md bg-canvas px-4 py-2 text-primary font-semibold text-xs border border-hairline select-none cursor-pointer">
                Google Play
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-charcoal flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-dark-muted">
          <span>&copy; {new Date().getFullYear()} TraDiva Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-on-dark transition-colors">Facebook</span>
            <span className="cursor-pointer hover:text-on-dark transition-colors">Twitter</span>
            <span className="cursor-pointer hover:text-on-dark transition-colors">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
