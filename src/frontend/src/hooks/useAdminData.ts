import type { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import type { Order, Product, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useAdminData() {
  const { actor, isFetching: actorFetching } = useActor();

  const usersQuery = useQuery<[Principal, UserProfile][]>({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllUsers();
    },
    enabled: !!actor && !actorFetching,
  });

  const productsQuery = useQuery<Product[]>({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });

  const ordersQuery = useQuery<Order[]>({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllOrders();
    },
    enabled: !!actor && !actorFetching,
  });

  return {
    users: usersQuery.data,
    products: productsQuery.data,
    orders: ordersQuery.data,
    isLoading:
      usersQuery.isLoading || productsQuery.isLoading || ordersQuery.isLoading,
  };
}
