import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileSetupModal() {
  const { isAuthenticated, userProfile, profileLoading, isFetched } = useAuth();
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !name.trim()) return;

    setIsSubmitting(true);
    try {
      await actor.saveCallerUserProfile(name.trim());
      toast.success("Profile created successfully!");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showProfileSetup}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Welcome to Smart Farmer Marketplace!</DialogTitle>
          <DialogDescription>
            Please tell us your name to get started
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full bg-earth-green hover:bg-earth-green/90"
          >
            {isSubmitting ? "Creating Profile..." : "Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
