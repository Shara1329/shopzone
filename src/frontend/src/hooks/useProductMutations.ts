import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import type { OrderId, ProductId } from "../backend";
import { useActor } from "./useActor";

export function useProductMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (data: {
      name: string;
      price: bigint;
      quantity: bigint;
      description: string;
      image: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createProduct(
        data.name,
        data.price,
        data.quantity,
        data.description,
        data.image,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmerProducts"] });
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async (data: {
      productId: ProductId;
      name: string;
      price: bigint;
      quantity: bigint;
      description: string;
      image: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(
        data.productId,
        data.name,
        data.price,
        data.quantity,
        data.description,
        data.image,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmerProducts"] });
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId: ProductId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmerProducts"] });
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });

  const placeOrder = useMutation({
    mutationFn: async (productId: ProductId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeOrder(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyerOrders"] });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async (data: {
      orderId: OrderId;
      status: "pending" | "accepted" | "delivered";
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(data.orderId, {
        [data.status]: null,
      } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmerOrders"] });
      queryClient.invalidateQueries({ queryKey: ["buyerOrders"] });
    },
  });

  const createReview = useMutation({
    mutationFn: async (data: {
      productId: ProductId;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createReview(data.productId, data.rating, data.comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allReviews"] });
    },
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    placeOrder,
    updateOrderStatus,
    createReview,
  };
}
