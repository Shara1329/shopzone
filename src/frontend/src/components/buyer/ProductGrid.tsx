import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Package } from "lucide-react";
import type { Product } from "../../backend";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Check back later for fresh produce
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product.id.toString()}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <button
            type="button"
            className="w-full aspect-video bg-muted overflow-hidden block"
            onClick={() =>
              navigate({
                to: "/product/$productId",
                params: { productId: product.id.toString() },
              })
            }
          >
            <img
              src={product.image.getDirectURL()}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.src =
                  "/assets/generated/product-placeholder.dim_400x300.png";
              }}
            />
          </button>
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <span className="line-clamp-1">{product.name}</span>
              <Badge variant="secondary">{Number(product.quantity)} left</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-earth-green mb-2">
              ${Number(product.price)}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-earth-green hover:bg-earth-green/90"
              onClick={() =>
                navigate({
                  to: "/product/$productId",
                  params: { productId: product.id.toString() },
                })
              }
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
