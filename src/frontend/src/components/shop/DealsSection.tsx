import { Tag } from "lucide-react";
import type { Product } from "../../data/products";
import { products } from "../../data/products";
import { ProductCard } from "./ProductCard";

interface DealsSectionProps {
  wishlistIds: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

export function DealsSection({
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
}: DealsSectionProps) {
  const deals = products.filter((p) => p.isDeal);

  return (
    <section className="lavender-band py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wide">
                Today's Deals
              </h2>
              <p className="text-xs text-muted-foreground">
                Limited time offers
              </p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {deals.length} products
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {deals.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              isInWishlist={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
