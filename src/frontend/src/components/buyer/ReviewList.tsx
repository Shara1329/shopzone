import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import type { Review, UserProfile } from "../../backend";
import { useActor } from "../../hooks/useActor";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const { actor } = useActor();

  const { data: profiles } = useQuery<Map<string, UserProfile>>({
    queryKey: ["reviewProfiles", reviews.map((r) => r.buyer.toString())],
    queryFn: async () => {
      if (!actor) return new Map();
      const profileMap = new Map<string, UserProfile>();
      for (const review of reviews) {
        try {
          const profile = await actor.getUserProfile(review.buyer);
          if (profile) {
            profileMap.set(review.buyer.toString(), profile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      return profileMap;
    },
    enabled: !!actor && reviews.length > 0,
  });

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const profile = profiles?.get(review.buyer.toString());
        return (
          <Card key={review.id.toString()}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">
                    {profile?.name || "Anonymous"}
                  </p>
                  <div className="flex text-harvest-yellow">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= Number(review.rating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
