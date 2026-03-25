import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import AccessDenied from "../components/common/AccessDenied";
import ProductForm from "../components/farmer/ProductForm";
import { useAuth } from "../hooks/useAuth";

export default function AddProduct() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <AccessDenied message="Please log in to add products" />;
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

      <h1 className="text-4xl font-bold mb-2">Add New Product</h1>
      <p className="text-muted-foreground mb-8">
        List your agricultural products for buyers
      </p>

      <ProductForm mode="create" />
    </div>
  );
}
