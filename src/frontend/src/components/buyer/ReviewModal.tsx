import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ProductId } from "../../backend";
import { useProductMutations } from "../../hooks/useProductMutations";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  productId: ProductId;
  productName: string;
}

export default function ReviewModal({
  open,
  onClose,
  productId,
  productName,
}: ReviewModalProps) {
  const { createReview } = useProductMutations();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      await createReview.mutateAsync({
        productId,
        rating: BigInt(rating),
        comment: comment.trim(),
      });
      toast.success("Review submitted successfully!");
      onClose();
      setRating(5);
      setComment("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {productName}</DialogTitle>
          <DialogDescription>
            Share your experience with this product
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={`transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "text-harvest-yellow"
                      : "text-gray-300"
                  }`}
                >
                  <Star
                    className="w-8 h-8"
                    fill={
                      star <= (hoveredRating || rating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={createReview.isPending}
              className="flex-1 bg-earth-green hover:bg-earth-green/90"
            >
              {createReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
