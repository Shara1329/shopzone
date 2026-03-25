import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Order, Product } from "../../backend";

interface OrderMonitoringProps {
  orders: Order[];
  products: Product[];
}

export default function OrderMonitoring({
  orders,
  products,
}: OrderMonitoringProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-harvest-yellow text-white">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-blue-500 text-white">Accepted</Badge>;
      case "delivered":
        return <Badge className="bg-earth-green text-white">Delivered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Order Monitoring
          </CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No orders found
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const product = products.find(
                  (p) => p.id.toString() === order.product.toString(),
                );
                return (
                  <TableRow key={order.id.toString()}>
                    <TableCell className="font-mono">
                      #{order.id.toString()}
                    </TableCell>
                    <TableCell>{product?.name || "Unknown"}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {order.buyer.toString().slice(0, 15)}...
                    </TableCell>
                    <TableCell>
                      {new Date(
                        Number(order.orderDate) / 1000000,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
