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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../../backend";
import { useProductMutations } from "../../hooks/useProductMutations";

interface ProductManagementProps {
  products: Product[];
}

export default function ProductManagement({
  products,
}: ProductManagementProps) {
  const { deleteProduct } = useProductMutations();

  const handleDelete = async (productId: bigint) => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Product Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No products found
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id.toString()}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${Number(product.price)}</TableCell>
                  <TableCell>{Number(product.quantity)} units</TableCell>
                  <TableCell className="font-mono text-xs">
                    {product.farmer.toString().slice(0, 15)}...
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{product.name}". This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
