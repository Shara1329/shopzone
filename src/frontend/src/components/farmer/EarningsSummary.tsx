import type { Order, Product } from "../../backend";

interface EarningsSummaryProps {
  orders: Order[];
  products: Product[];
}

export default function EarningsSummary({
  orders,
  products,
}: EarningsSummaryProps) {
  const totalEarnings = orders.reduce((sum, order) => {
    if (order.status === "accepted" || order.status === "delivered") {
      const product = products.find(
        (p) => p.id.toString() === order.product.toString(),
      );
      return sum + (product ? Number(product.price) : 0);
    }
    return sum;
  }, 0);

  return (
    <div className="text-3xl font-bold text-warm-brown">${totalEarnings}</div>
  );
}
