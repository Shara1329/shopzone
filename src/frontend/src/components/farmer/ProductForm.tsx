import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import type { ExternalBlob, Product } from "../../backend";
import { useProductMutations } from "../../hooks/useProductMutations";
import ImageUpload from "./ImageUpload";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
}

export default function ProductForm({ mode, product }: ProductFormProps) {
  const navigate = useNavigate();
  const { createProduct, updateProduct } = useProductMutations();

  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(
    product ? Number(product.price).toString() : "",
  );
  const [quantity, setQuantity] = useState(
    product ? Number(product.quantity).toString() : "",
  );
  const [description, setDescription] = useState(product?.description || "");
  const [image, setImage] = useState<ExternalBlob | null>(
    product?.image || null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload a product image");
      return;
    }

    const priceNum = Number.parseFloat(price);
    const quantityNum = Number.parseInt(quantity);

    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (Number.isNaN(quantityNum) || quantityNum <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      if (mode === "create") {
        await createProduct.mutateAsync({
          name,
          price: BigInt(Math.round(priceNum)),
          quantity: BigInt(quantityNum),
          description,
          image,
        });
        toast.success("Product created successfully!");
      } else if (product) {
        await updateProduct.mutateAsync({
          productId: product.id,
          name,
          price: BigInt(Math.round(priceNum)),
          quantity: BigInt(quantityNum),
          description,
          image,
        });
        toast.success("Product updated successfully!");
      }
      navigate({ to: "/farmer" });
    } catch (error: any) {
      toast.error(error.message || `Failed to ${mode} product`);
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Product Details" : "Update Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Fresh Tomatoes"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity (units) *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product..."
              rows={4}
              required
            />
          </div>
          <div>
            <Label>Product Image *</Label>
            <ImageUpload image={image} onImageChange={setImage} />
          </div>
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-earth-green hover:bg-earth-green/90"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create Product"
                  : "Update Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/farmer" })}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
