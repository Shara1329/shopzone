import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import type { CartItem } from "../../types/cart";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderPlaced: () => void;
}

export default function CheckoutModal({
  open,
  onClose,
  items,
  onOrderPlaced,
}: CheckoutModalProps) {
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@"))
      e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onOrderPlaced();
    onClose();
    setForm({ name: "", email: "", address: "" });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="checkout.dialog"
        className="sm:max-w-md bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-700">
            Complete Order
          </DialogTitle>
        </DialogHeader>

        {/* Order summary */}
        <div className="bg-muted/40 rounded-lg p-4 space-y-2">
          <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-2">
            Order Summary
          </p>
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.product.name} ×{item.quantity}
              </span>
              <span className="font-600">
                ${(item.product.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2 flex justify-between font-display font-700">
            <span>Total</span>
            <span className="text-primary">${subtotal.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <Label htmlFor="co-name" className="text-sm font-500">
              Full Name
            </Label>
            <Input
              id="co-name"
              data-ocid="checkout.input"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p
                data-ocid="checkout.error_state"
                className="text-xs text-destructive"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="co-email" className="text-sm font-500">
              Email
            </Label>
            <Input
              id="co-email"
              data-ocid="checkout.input"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p
                data-ocid="checkout.error_state"
                className="text-xs text-destructive"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="co-address" className="text-sm font-500">
              Shipping Address
            </Label>
            <Textarea
              id="co-address"
              data-ocid="checkout.textarea"
              placeholder="123 Main St, City, State ZIP"
              rows={3}
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p
                data-ocid="checkout.error_state"
                className="text-xs text-destructive"
              >
                {errors.address}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button
              data-ocid="checkout.cancel_button"
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              data-ocid="checkout.submit_button"
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} /> Place Order
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
