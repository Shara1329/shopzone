import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingCart, Users } from "lucide-react";
import OrderMonitoring from "../components/admin/OrderMonitoring";
import ProductManagement from "../components/admin/ProductManagement";
import UserManagement from "../components/admin/UserManagement";
import AccessDenied from "../components/common/AccessDenied";
import { useAdminData } from "../hooks/useAdminData";
import { useAuth } from "../hooks/useAuth";

export default function AdminDashboard() {
  const { isAuthenticated, userRole, isLoading: authLoading } = useAuth();
  const { users, products, orders, isLoading } = useAdminData();

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

  if (!isAuthenticated || userRole !== "admin") {
    return <AccessDenied message="Admin access required" />;
  }

  const totalRevenue =
    orders?.reduce((sum, order) => {
      if (order.status === "delivered" || order.status === "accepted") {
        const product = products?.find(
          (p) => p.id.toString() === order.product.toString(),
        );
        return sum + (product ? Number(product.price) : 0);
      }
      return sum;
    }, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage users, products, and monitor marketplace activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-earth-green">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="w-4 h-4 text-earth-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-harvest-yellow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="w-4 h-4 text-harvest-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warm-brown">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-warm-brown" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{orders?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue: ${totalRevenue}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement users={users || []} />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement products={products || []} />
        </TabsContent>

        <TabsContent value="orders">
          <OrderMonitoring orders={orders || []} products={products || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
