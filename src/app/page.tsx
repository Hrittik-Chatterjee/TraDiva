import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-canvas">
      {/* Hero Band Marketing (based on DESIGN.md) */}
      <section className="w-full max-w-7xl px-6 py-20 md:py-32 flex flex-col items-center text-center">
        {/* Top canary yellow badge tag */}
        <div className="mb-6 inline-flex items-center rounded-full bg-surface-yellow px-4 py-1.5 text-xs font-semibold text-yellow-dark">
          ⚡ Welcome to TraDiva alpha
        </div>

        {/* Hero Headline (80px at desktop, line-height 1.05, letter-spacing -2px) */}
        <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-[80px] font-medium leading-[1.05] tracking-tight md:tracking-[-2px] text-ink mb-6">
          The premium shopping experience built for speed.
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl text-lg sm:text-xl text-steel mb-10 leading-relaxed">
          Browse products, search catalog instantly, and checkout seamlessly as a guest. Built from scratch for ultimate performance and responsiveness.
        </p>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/catalog"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-on-primary hover:bg-charcoal active:scale-[0.98] transition-all"
          >
            Start Shopping
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-hairline-strong bg-transparent px-8 text-sm font-medium text-ink hover:bg-surface active:scale-[0.98] transition-all"
          >
            Learn More
          </Link>
        </div>

        {/* Whiteboard Mockup Image placeholder frame */}
        <div className="mt-16 w-full max-w-5xl rounded-xl border border-hairline-soft bg-surface p-8 shadow-mockup aspect-video flex flex-col justify-center items-center">
          <div className="flex items-center gap-4 text-steel mb-2 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-brand-teal"></span>
            Real-time Catalog Preview
          </div>
          <p className="text-xs text-stone">Mockup Board visualization representing live inventory sync.</p>
        </div>
      </section>
    </div>
  );
}
