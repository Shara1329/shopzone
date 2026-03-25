import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Star } from "lucide-react";
import { useState } from "react";
import type { Order, Product } from "../../backend";
import ReviewModal from "./ReviewModal";

interface OrderCardProps {
  order: Order;
  products: Product[];
}

export default function OrderCard({ order, products }: OrderCardProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const product = products.find(
    (p) => p.id.toString() === order.product.toString(),
  );

  const getStatusBadge = () => {
    switch (order.status) {
      case "pending":
        return <Badge className="bg-harvest-yellow text-white">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-blue-500 text-white">Accepted</Badge>;
      case "delivered":
        return <Badge className="bg-earth-green text-white">Delivered</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span>Order #{order.id.toString()}</span>
            </div>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Product</p>
                <p className="font-medium">
                  {product?.name || "Unknown Product"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium text-earth-green">
                  ${product ? Number(product.price) : 0}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(
                    Number(order.orderDate) / 1000000,
                  ).toLocaleDateString()}
                </p>
              </div>
              {order.status === "delivered" && (
                <Button
                  onClick={() => setShowReviewModal(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Leave Review
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {product && (
        <ReviewModal
          open={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          productId={product.id}
          productName={product.name}
        />
      )}
    </>
  );
}
