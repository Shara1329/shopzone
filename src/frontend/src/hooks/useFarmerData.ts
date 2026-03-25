import { useQuery } from "@tanstack/react-query";
import type { Order, Product } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useFarmerData() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const productsQuery = useQuery<Product[]>({
    queryKey: ["farmerProducts", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getProductsByFarmer(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !actorFetching,
  });

  const ordersQuery = useQuery<Order[]>({
    queryKey: ["farmerOrders", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getOrdersByFarmer();
    },
    enabled: !!actor && !!identity && !actorFetching,
  });

  return {
    products: productsQuery.data,
    orders: ordersQuery.data,
    isLoading: productsQuery.isLoading || ordersQuery.isLoading,
    refetch: () => {
      productsQuery.refetch();
      ordersQuery.refetch();
    },
  };
}
