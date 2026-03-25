import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import AccessDenied from "../components/common/AccessDenied";
import ProductForm from "../components/farmer/ProductForm";
import { useAuth } from "../hooks/useAuth";
import { useFarmerData } from "../hooks/useFarmerData";

export default function EditProduct() {
  const { productId } = useParams({ from: "/farmer/edit-product/$productId" });
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { products, isLoading } = useFarmerData();

  const product = products?.find((p) => p.id.toString() === productId);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDenied message="Please log in to edit products" />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Product not found</p>
        <Button onClick={() => navigate({ to: "/farmer" })}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/farmer" })}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <h1 className="text-4xl font-bold mb-2">Edit Product</h1>
      <p className="text-muted-foreground mb-8">
        Update your product information
      </p>

      <ProductForm mode="edit" product={product} />
    </div>
  );
}
