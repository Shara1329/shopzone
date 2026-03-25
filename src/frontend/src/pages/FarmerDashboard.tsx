import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { DollarSign, Package, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import AccessDenied from "../components/common/AccessDenied";
import EarningsSummary from "../components/farmer/EarningsSummary";
import OrderItem from "../components/farmer/OrderItem";
import ProductCard from "../components/farmer/ProductCard";
import { useAuth } from "../hooks/useAuth";
import { useFarmerData } from "../hooks/useFarmerData";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { products, orders, isLoading } = useFarmerData();
  const [activeTab, setActiveTab] = useState("products");

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AccessDenied message="Please log in to access the farmer dashboard" />
    );
  }

  const pendingOrders = orders?.filter((o) => o.status === "pending") || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Farmer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your products and orders
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/farmer/add-product" })}
          className="bg-earth-green hover:bg-earth-green/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-earth-green">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="w-4 h-4 text-earth-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-harvest-yellow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-harvest-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingOrders.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warm-brown">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
            <DollarSign className="w-4 h-4 text-warm-brown" />
          </CardHeader>
          <CardContent>
            <EarningsSummary orders={orders || []} products={products || []} />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          {!products || products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your first product
                </p>
                <Button
                  onClick={() => navigate({ to: "/farmer/add-product" })}
                  className="bg-earth-green hover:bg-earth-green/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="orders">
          {!orders || orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">
                  Orders will appear here when buyers place them
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderItem
                  key={order.id.toString()}
                  order={order}
                  products={products || []}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
