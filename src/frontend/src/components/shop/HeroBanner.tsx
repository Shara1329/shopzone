import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useState } from "react";

const slides = [
  {
    id: "deals",
    headline: "Shop the Latest Trends",
    subtitle:
      "Discover amazing deals on electronics, fashion, beauty, and more \u2014 all in one place.",
    cta: "EXPLORE COLLECTIONS",
    accent: "Up to 80% Off",
  },
  {
    id: "new",
    headline: "Today's Hottest Deals",
    subtitle:
      "Limited-time offers on top brands. Don't miss out on massive savings across all categories.",
    cta: "SHOP DEALS NOW",
    accent: "New Arrivals",
  },
  {
    id: "tech",
    headline: "Premium Tech at Best Prices",
    subtitle:
      "The latest phones, laptops, and gadgets from top brands. Free shipping on orders over $50.",
    cta: "SHOP ELECTRONICS",
    accent: "Free Shipping",
  },
];

interface HeroBannerProps {
  onShopNow: () => void;
}

export function HeroBanner({ onShopNow }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const slide = slides[current];

  return (
    <section className="hero-gradient rounded-2xl mx-4 md:mx-8 my-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-20 flex items-center justify-between gap-8">
        <div className="flex-1 min-w-0">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4 backdrop-blur-sm">
            {slide.accent}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {slide.headline}
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-8 max-w-md">
            {slide.subtitle}
          </p>
          <button
            type="button"
            onClick={onShopNow}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-white/90 transition-all shadow-lg"
            data-ocid="hero.primary_button"
          >
            <ShoppingBag className="w-5 h-5" />
            {slide.cta}
          </button>
        </div>
        <div className="hidden md:flex shrink-0 w-64 h-64 items-center justify-center">
          <div className="relative">
            <div className="w-56 h-56 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-white/15 flex items-center justify-center">
                <ShoppingBag className="w-20 h-20 text-white/80" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-white text-xs font-bold">NEW</span>
            </div>
            <div className="absolute -bottom-2 -left-4 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">SALE</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-2">
          {slides.map((s, dotIdx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrent(dotIdx)}
              className={`h-2 rounded-full transition-all ${
                dotIdx === current ? "bg-white w-6" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
