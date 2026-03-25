import { type Category, categoryMeta } from "../../data/products";

interface CategoriesSectionProps {
  onCategoryClick: (cat: Category) => void;
  activeCategory: Category;
}

export function CategoriesSection({
  onCategoryClick,
  activeCategory,
}: CategoriesSectionProps) {
  const cats = Object.entries(categoryMeta) as [
    Exclude<Category, "all">,
    { label: string; icon: string },
  ][];

  const handleClick = (cat: Category) => {
    onCategoryClick(cat);
    setTimeout(() => {
      document
        .getElementById("product-grid-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Explore Our Categories
        </h2>
        <span className="text-sm text-muted-foreground">
          {cats.length} categories
        </span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-3">
        <button
          type="button"
          onClick={() => handleClick("all")}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all group ${
            activeCategory === "all"
              ? "bg-primary text-white border-primary"
              : "bg-primary/10 hover:bg-primary/20 border-primary"
          }`}
          data-ocid="categories.button"
        >
          <span className="text-2xl">🛍️</span>
          <span
            className={`text-xs font-semibold text-center ${
              activeCategory === "all" ? "text-white" : "text-primary"
            }`}
          >
            All
          </span>
        </button>
        {cats.map(([key, meta]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleClick(key)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all group ${
              activeCategory === key
                ? "bg-primary text-white border-primary"
                : "bg-muted hover:bg-primary/10 border-transparent hover:border-primary"
            }`}
            data-ocid="categories.button"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {meta.icon}
            </span>
            <span
              className={`text-xs font-medium text-center leading-tight ${
                activeCategory === key
                  ? "text-white"
                  : "text-muted-foreground group-hover:text-primary"
              }`}
            >
              {meta.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
