import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { CartItem, Order } from "../../types/shop";
import { CheckoutForm } from "./CheckoutForm";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: (order: Order) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleClose = () => {
    setShowCheckout(false);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-50 w-full cursor-default"
          onClick={handleClose}
          aria-label="Close cart"
        />
      )}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-ocid="cart.modal"
      >
        {showCheckout ? (
          <CheckoutForm
            items={items}
            onBack={() => setShowCheckout(false)}
            onCheckout={onCheckout}
            onClose={handleClose}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({itemCount} items)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded hover:bg-muted transition-colors"
                data-ocid="cart.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full text-muted-foreground"
                  data-ocid="cart.empty_state"
                >
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
                  <p className="font-semibold">Your cart is empty</p>
                  <p className="text-sm mt-1">
                    Add some products to get started!
                  </p>
                </div>
              ) : (
                items.map((item, i) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 bg-muted rounded-xl"
                    data-ocid={`cart.item.${i + 1}`}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1">
                        ₹{item.product.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center hover:border-primary transition-colors"
                          data-ocid={`cart.secondary_button.${i + 1}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center hover:border-primary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemove(item.product.id)}
                          className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                          data-ocid={`cart.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-bold text-foreground">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                  data-ocid="cart.submit_button"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
