import {
  Apple,
  BookOpen,
  Dumbbell,
  Gamepad2,
  Gem,
  Grid3X3,
  Headphones,
  Home,
  Laptop,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sofa,
  Sparkles,
  Tv,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import type { Category } from "../../data/products";

const categories: { id: Category; label: string; Icon: React.ElementType }[] = [
  { id: "all", label: "All", Icon: Grid3X3 },
  { id: "electronics", label: "Electronics", Icon: Tv },
  { id: "phones", label: "Phones", Icon: Smartphone },
  { id: "laptops", label: "Laptops", Icon: Laptop },
  { id: "accessories", label: "Accessories", Icon: Headphones },
  { id: "dresses", label: "Dresses", Icon: Sparkles },
  { id: "mens-clothing", label: "Men's", Icon: Shirt },
  { id: "footwear", label: "Footwear", Icon: ShoppingBag },
  { id: "home-appliances", label: "Appliances", Icon: Home },
  { id: "beauty", label: "Beauty", Icon: Gem },
  { id: "sports", label: "Sports", Icon: Dumbbell },
  { id: "toys", label: "Toys", Icon: Gamepad2 },
  { id: "furniture", label: "Furniture", Icon: Sofa },
  { id: "books", label: "Books", Icon: BookOpen },
  { id: "food", label: "Food", Icon: UtensilsCrossed },
];

// suppress unused import warnings
const _unused = [Apple];

interface CategoryFilterProps {
  selected: Category;
  onChange: (c: Category) => void;
}

export default function CategoryFilter({
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      role="tablist"
      aria-label="Product categories"
    >
      {categories.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={selected === id}
          data-ocid={`category.${id}.tab`}
          onClick={() => onChange(id)}
          className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-500 whitespace-nowrap transition-all shrink-0 ${
            selected === id
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          {selected === id && (
            <motion.div
              layoutId="category-pill"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-1.5">
            <Icon size={13} />
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
