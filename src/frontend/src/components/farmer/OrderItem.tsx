import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Package, X } from "lucide-react";
import { toast } from "sonner";
import type { Order, Product } from "../../backend";
import { useProductMutations } from "../../hooks/useProductMutations";

interface OrderItemProps {
  order: Order;
  products: Product[];
}

export default function OrderItem({ order, products }: OrderItemProps) {
  const { updateOrderStatus } = useProductMutations();
  const product = products.find(
    (p) => p.id.toString() === order.product.toString(),
  );

  const handleStatusUpdate = async (status: "accepted" | "delivered") => {
    try {
      await updateOrderStatus.mutateAsync({ orderId: order.id, status });
      toast.success(`Order ${status}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-harvest-yellow text-white">
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="secondary" className="bg-blue-500 text-white">
            Accepted
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-earth-green text-white">
            Delivered
          </Badge>
        );
    }
  };

  return (
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
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Product</p>
            <p className="font-medium">{product?.name || "Unknown Product"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-medium text-earth-green">
              ${product ? Number(product.price) : 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-medium">
              {new Date(Number(order.orderDate) / 1000000).toLocaleDateString()}
            </p>
          </div>
          {order.status === "pending" && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handleStatusUpdate("accepted")}
                disabled={updateOrderStatus.isPending}
                className="flex-1 bg-earth-green hover:bg-earth-green/90"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept
              </Button>
            </div>
          )}
          {order.status === "accepted" && (
            <Button
              onClick={() => handleStatusUpdate("delivered")}
              disabled={updateOrderStatus.isPending}
              className="w-full bg-earth-green hover:bg-earth-green/90"
            >
              <Package className="w-4 h-4 mr-2" />
              Mark as Delivered
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
