import { ArrowLeft, CheckCircle2, MapPin, Package, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CartItem, Order } from "../../types/shop";

interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CheckoutFormProps {
  items: CartItem[];
  onBack: () => void;
  onCheckout: (order: Order) => void;
  onClose: () => void;
}

export function CheckoutForm({
  items,
  onBack,
  onCheckout,
  onClose,
}: CheckoutFormProps) {
  const [details, setDetails] = useState<CustomerDetails>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const set = (field: keyof CustomerDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e: Partial<CustomerDetails> = {};
    if (!details.fullName.trim()) e.fullName = "Full name is required";
    if (!details.email.trim() || !details.email.includes("@"))
      e.email = "Valid email is required";
    if (!details.phone.trim()) e.phone = "Phone number is required";
    if (!details.street.trim()) e.street = "Street address is required";
    if (!details.city.trim()) e.city = "City is required";
    if (!details.state.trim()) e.state = "State/Province is required";
    if (!details.postalCode.trim()) e.postalCode = "Postal code is required";
    if (!details.country.trim()) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const order: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...items],
      total: subtotal,
      customer: details,
    };
    onCheckout(order);
    onClose();
    toast.success("Order placed successfully! 🎉", {
      description: `Order ${order.id} confirmed for ₹${subtotal.toFixed(2)}`,
    });
  };

  const Field = ({
    id,
    label,
    field,
    type = "text",
    placeholder,
    required = true,
  }: {
    id: string;
    label: string;
    field: keyof CustomerDetails;
    type?: string;
    placeholder: string;
    required?: boolean;
  }) => (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-foreground/70 uppercase tracking-wide"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={details[field]}
        onChange={(e) => set(field, e.target.value)}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
          errors[field] ? "border-destructive" : "border-border"
        }`}
      />
      {errors[field] && (
        <p className="text-xs text-destructive">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full" data-ocid="checkout.modal">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          data-ocid="checkout.cancel_button"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-lg leading-none">Checkout</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {itemCount} item{itemCount !== 1 ? "s" : ""} · ₹
            {subtotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} id="checkout-form" noValidate>
          {/* Personal Details */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                Personal Details
              </h3>
            </div>
            <Field
              id="cf-name"
              label="Full Name"
              field="fullName"
              placeholder="Rahul Sharma"
            />
            <Field
              id="cf-email"
              label="Email Address"
              field="email"
              type="email"
              placeholder="rahul@example.com"
            />
            <Field
              id="cf-phone"
              label="Phone Number"
              field="phone"
              type="tel"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Delivery Address */}
          <div className="p-4 pt-0 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                Delivery Address
              </h3>
            </div>
            <Field
              id="cf-street"
              label="Street Address"
              field="street"
              placeholder="123, MG Road, Koramangala"
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                id="cf-city"
                label="City"
                field="city"
                placeholder="Bengaluru"
              />
              <Field
                id="cf-state"
                label="State / Province"
                field="state"
                placeholder="Karnataka"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field
                id="cf-postal"
                label="Postal / ZIP Code"
                field="postalCode"
                placeholder="560001"
              />
              <Field
                id="cf-country"
                label="Country"
                field="country"
                placeholder="India"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="mx-4 mb-4 rounded-xl bg-muted/60 border border-border p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">
                Order Summary
              </h3>
            </div>
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between text-xs text-foreground/80"
              >
                <span className="truncate pr-2">
                  {item.product.name} ×{item.quantity}
                </span>
                <span className="font-semibold shrink-0">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-border/60 pt-2 mt-1 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Delivery</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between font-bold text-foreground pt-1">
                <span>Total</span>
                <span className="text-primary text-base">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky place order button */}
      <div className="p-4 border-t border-border shrink-0">
        <button
          type="submit"
          form="checkout-form"
          className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          data-ocid="checkout.submit_button"
        >
          <CheckCircle2 className="w-5 h-5" />
          Place Order · ₹{subtotal.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
