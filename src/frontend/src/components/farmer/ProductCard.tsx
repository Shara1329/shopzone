import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../../backend";
import { useProductMutations } from "../../hooks/useProductMutations";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { deleteProduct } = useProductMutations();

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Product deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted overflow-hidden">
        <img
          src={product.image.getDirectURL()}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "/assets/generated/product-placeholder.dim_400x300.png";
          }}
        />
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="line-clamp-1">{product.name}</span>
          <Badge variant="secondary">{Number(product.quantity)} units</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-earth-green mb-2">
          ${Number(product.price)}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() =>
            navigate({
              to: "/farmer/edit-product/$productId",
              params: { productId: product.id.toString() },
            })
          }
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                product.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
