import { useQuery } from "@tanstack/react-query";
import type { Product, Review } from "../backend";
import { useActor } from "./useActor";

export function useBuyerData() {
  const { actor, isFetching: actorFetching } = useActor();

  const productsQuery = useQuery<Product[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });

  const reviewsQuery = useQuery<Review[]>({
    queryKey: ["allReviews"],
    queryFn: async () => {
      if (!actor) return [];
      const products = await actor.getAllProducts();
      const allReviews: Review[] = [];
      for (const product of products) {
        const reviews = await actor.getReviewsByProduct(product.id);
        allReviews.push(...reviews);
      }
      return allReviews;
    },
    enabled: !!actor && !actorFetching,
  });

  return {
    products: productsQuery.data,
    reviews: reviewsQuery.data,
    isLoading: productsQuery.isLoading || reviewsQuery.isLoading,
  };
}
