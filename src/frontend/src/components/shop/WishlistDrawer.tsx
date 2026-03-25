import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import { products } from "../../data/products";
import type { Product } from "../../data/products";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: number[];
  onRemove: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  onRemove,
  onAddToCart,
}: WishlistDrawerProps) {
  const wishlistItems = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-50 w-full cursor-default"
          onClick={onClose}
          aria-label="Close wishlist"
        />
      )}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-ocid="wishlist.modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive fill-current" />
            <h2 className="font-bold text-lg">Wishlist</h2>
            <span className="text-sm text-muted-foreground">
              ({wishlistItems.length} items)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-muted transition-colors"
            data-ocid="wishlist.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistItems.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full text-muted-foreground"
              data-ocid="wishlist.empty_state"
            >
              <Heart className="w-16 h-16 mb-4 opacity-30" />
              <p className="font-semibold">Your wishlist is empty</p>
              <p className="text-sm mt-1">Heart a product to save it here!</p>
            </div>
          ) : (
            wishlistItems.map((product, i) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-muted rounded-xl"
                data-ocid={`wishlist.item.${i + 1}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground line-clamp-2">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-primary">
                      ${product.price}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(product);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      data-ocid={`wishlist.submit_button.${i + 1}`}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(product.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      data-ocid={`wishlist.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
