import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import ProductGrid from "../components/buyer/ProductGrid";
import SearchBar from "../components/buyer/SearchBar";
import { useBuyerData } from "../hooks/useBuyerData";

export default function BuyerDashboard() {
  const { products, isLoading } = useBuyerData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-12 w-full max-w-md mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Browse Products
        </h1>
        <p className="text-muted-foreground">
          Fresh produce directly from local farmers
        </p>
      </div>

      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ProductGrid products={filteredProducts || []} />
    </div>
  );
}
