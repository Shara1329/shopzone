import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "../../data/products";

const STAR_POSITIONS = [0, 1, 2, 3, 4] as const;

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (product: Product) => void;
  index: number;
}

export function ProductCard({
  product,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  index,
}: ProductCardProps) {
  const ocidIndex = index + 1;

  return (
    <div
      className="bg-card rounded-xl card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden group flex flex-col"
      data-ocid={`products.item.${ocidIndex}`}
    >
      <div className="relative overflow-hidden bg-muted aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.isNew ? (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">
            NEW
          </span>
        ) : product.discount > 0 ? (
          <span className="absolute top-2 left-2 bg-destructive text-white text-xs font-bold px-2 py-0.5 rounded">
            -{product.discount}%
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-colors ${
            isInWishlist
              ? "text-destructive"
              : "text-muted-foreground hover:text-destructive"
          }`}
          data-ocid={`products.toggle.${ocidIndex}`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1 gap-2">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
          {product.name}
        </h3>

        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {STAR_POSITIONS.map((pos) => (
              <Star
                key={pos}
                className={`w-3 h-3 ${
                  pos < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : pos < product.rating
                      ? "fill-yellow-200 text-yellow-400"
                      : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-foreground">
            ${product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all"
          data-ocid={`products.submit_button.${ocidIndex}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
