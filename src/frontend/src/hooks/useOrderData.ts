import type { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import type { Order, Product } from "../backend";
import { useActor } from "./useActor";

export function useOrderData(buyer?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  const ordersQuery = useQuery<Order[]>({
    queryKey: ["buyerOrders", buyer?.toString()],
    queryFn: async () => {
      if (!actor || !buyer) return [];
      return actor.getOrdersByBuyer(buyer);
    },
    enabled: !!actor && !!buyer && !actorFetching,
  });

  const productsQuery = useQuery<Product[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });

  return {
    orders: ordersQuery.data,
    products: productsQuery.data,
    isLoading: ordersQuery.isLoading || productsQuery.isLoading,
  };
}
