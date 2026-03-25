import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { CartDrawer } from "./components/shop/CartDrawer";
import { CategoriesSection } from "./components/shop/CategoriesSection";
import { DealsSection } from "./components/shop/DealsSection";
import { FeaturedSection } from "./components/shop/FeaturedSection";
import { Footer } from "./components/shop/Footer";
import { Header } from "./components/shop/Header";
import { HeroBanner } from "./components/shop/HeroBanner";
import { ProductGrid } from "./components/shop/ProductGrid";
import { WishlistDrawer } from "./components/shop/WishlistDrawer";
import type { Category, Product } from "./data/products";
import { OrdersPage } from "./pages/OrdersPage";
import type { CartItem, Order } from "./types/shop";

const WISHLIST_KEY = "shopzone_wishlist";
const ORDERS_KEY = "shopzone_orders";
const USER_KEY = "shopzone_user";

interface AuthUser {
  name: string;
  email: string;
}

function loadWishlist(): number[] {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? (JSON.parse(stored) as number[]) : [];
  } catch {
    return [];
  }
}

function loadOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? (JSON.parse(stored) as Order[]) : [];
  } catch {
    return [];
  }
}

function loadUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>(loadWishlist);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Persist orders
  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const handleLogin = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  };

  const handleToggleWishlist = (id: number) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id],
    );
  };

  const handleCheckout = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
  };

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    if (activePage !== "home") setActivePage("home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        cartItems={cartItems}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        activePage={activePage}
        onNavigate={setActivePage}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activePage === "home" && (
          <>
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-3 pb-0">
              <nav className="text-xs text-muted-foreground">
                <span>Home</span>
                {activeCategory !== "all" && (
                  <>
                    <span className="mx-1">&gt;</span>
                    <span className="text-primary capitalize">
                      {activeCategory.replace("-", " ")}
                    </span>
                  </>
                )}
              </nav>
            </div>

            <HeroBanner onShopNow={() => setActiveCategory("all")} />
            <CategoriesSection
              onCategoryClick={handleCategoryChange}
              activeCategory={activeCategory}
            />
            <DealsSection
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
            />
            <FeaturedSection
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
            />
            <div id="product-grid-section">
              <ProductGrid
                activeCategory={activeCategory}
                searchQuery={searchQuery}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </>
        )}

        {activePage === "orders" && (
          <OrdersPage orders={orders} onBack={() => setActivePage("home")} />
        )}
      </main>

      <Footer />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistIds={wishlistIds}
        onRemove={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}
