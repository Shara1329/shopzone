import {
  Calendar,
  ChevronLeft,
  Hash,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import type { Order } from "../types/shop";

interface OrdersPageProps {
  orders: Order[];
  onBack: () => void;
}

export function OrdersPage({ orders, onBack }: OrdersPageProps) {
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-primary hover:underline text-sm font-medium"
          data-ocid="orders.secondary_button"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </button>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            {orders.length} order{orders.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {sortedOrders.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-32 text-muted-foreground"
          data-ocid="orders.empty_state"
        >
          <ShoppingBag className="w-20 h-20 mb-6 opacity-20" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            No orders yet
          </h2>
          <p className="text-sm">Start shopping to see your orders here!</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            data-ocid="orders.primary_button"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order, i) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-2xl overflow-hidden card-shadow"
              data-ocid={`orders.item.${i + 1}`}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Hash className="w-4 h-4 text-primary" />
                    {order.id}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    Delivered
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    ₹{order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer details if available */}
              {order.customer && (
                <div className="px-6 py-3 border-b border-border bg-primary/5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {order.customer.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      {order.customer.street}, {order.customer.city},{" "}
                      {order.customer.state} {order.customer.postalCode},{" "}
                      {order.customer.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      {order.customer.phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="px-6 py-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} × ₹{item.product.price}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-foreground shrink-0">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-6 py-3 border-t border-border bg-muted/30 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {order.items.reduce((s, item) => s + item.quantity, 0)} item
                  {order.items.reduce((s, item) => s + item.quantity, 0) !== 1
                    ? "s"
                    : ""}
                </span>
                <span className="text-sm font-bold text-foreground">
                  Total: ₹{order.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
