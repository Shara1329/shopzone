import { Package } from "lucide-react";
import type { Product } from "../../data/products";
import { type Category, categoryMeta, products } from "../../data/products";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  activeCategory: Category;
  searchQuery: string;
  wishlistIds: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (product: Product) => void;
  onCategoryChange: (cat: Category) => void;
}

export function ProductGrid({
  activeCategory,
  searchQuery,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onCategoryChange,
}: ProductGridProps) {
  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const cats = Object.entries(categoryMeta) as [
    Exclude<Category, "all">,
    { label: string; icon: string },
  ][];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {activeCategory === "all"
            ? "All Products"
            : categoryMeta[activeCategory as Exclude<Category, "all">]?.label}
        </h2>
        <span className="text-sm text-muted-foreground">
          {filtered.length} products
        </span>
      </div>

      {/* Scrollable category pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer select-none ${
            activeCategory === "all"
              ? "bg-primary text-white border-primary shadow-md"
              : "bg-white text-foreground border-border hover:bg-primary hover:text-white hover:border-primary hover:shadow-md active:scale-95"
          }`}
          data-ocid="products.tab"
        >
          All
        </button>
        {cats.map(([key, meta]) => (
          <button
            key={key}
            type="button"
            onClick={() => onCategoryChange(key)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer select-none ${
              activeCategory === key
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-white text-foreground border-border hover:bg-primary hover:text-white hover:border-primary hover:shadow-md active:scale-95"
            }`}
            data-ocid="products.tab"
          >
            {meta.icon} {meta.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-muted-foreground"
          data-ocid="products.empty_state"
        >
          <Package className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-semibold">No products found</p>
          <p className="text-sm mt-1">
            Try adjusting your search or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
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
      )}
    </section>
  );
}
