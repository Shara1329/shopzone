import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import ReviewList from "../components/buyer/ReviewList";
import { useBuyerData } from "../hooks/useBuyerData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useProductMutations } from "../hooks/useProductMutations";

export default function ProductDetail() {
  const { productId } = useParams({ from: "/product/$productId" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { products, reviews, isLoading } = useBuyerData();
  const { placeOrder } = useProductMutations();

  const product = products?.find((p) => p.id.toString() === productId);

  const handlePlaceOrder = async () => {
    if (!identity) {
      toast.error("Please log in to place an order");
      return;
    }

    if (!product) return;

    try {
      await placeOrder.mutateAsync(product.id);
      toast.success("Order placed successfully!");
      navigate({ to: "/buyer/orders" });
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Product not found</h3>
            <Button
              onClick={() => navigate({ to: "/buyer" })}
              variant="outline"
            >
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const productReviews =
    reviews?.filter((r) => r.product.toString() === productId) || [];
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
        productReviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/buyer" })}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden bg-muted">
          <img
            src={product.image.getDirectURL()}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "/assets/generated/product-placeholder.dim_400x300.png";
            }}
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-earth-green">
              ${Number(product.price)}
            </span>
            <Badge variant="secondary" className="text-base">
              {Number(product.quantity)} units available
            </Badge>
          </div>

          {averageRating > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= averageRating
                        ? "text-harvest-yellow"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({productReviews.length}{" "}
                {productReviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Button
            onClick={handlePlaceOrder}
            disabled={
              !identity ||
              placeOrder.isPending ||
              Number(product.quantity) === 0
            }
            className="w-full bg-earth-green hover:bg-earth-green/90"
            size="lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {placeOrder.isPending ? "Placing Order..." : "Place Order"}
          </Button>

          {!identity && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Please log in to place an order
            </p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewList reviews={productReviews} />
        </CardContent>
      </Card>
    </div>
  );
}
