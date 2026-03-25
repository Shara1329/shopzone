import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";
import OrderCard from "../components/buyer/OrderCard";
import AccessDenied from "../components/common/AccessDenied";
import { useAuth } from "../hooks/useAuth";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useOrderData } from "../hooks/useOrderData";

export default function OrderHistory() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { identity } = useInternetIdentity();
  const { orders, products, isLoading } = useOrderData(
    identity?.getPrincipal(),
  );

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDenied message="Please log in to view your order history" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Order History
        </h1>
        <p className="text-muted-foreground">
          Track your orders and leave reviews
        </p>
      </div>

      {!orders || orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground">
              Start shopping to see your orders here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id.toString()}
              order={order}
              products={products || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
