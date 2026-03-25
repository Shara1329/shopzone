import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Category } from "../../data/products";
import type { CartItem } from "../../types/shop";
import { AuthModal } from "./AuthModal";

interface AuthUser {
  name: string;
  email: string;
}

interface HeaderProps {
  cartItems: CartItem[];
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
}

const navLinks = [
  { label: "Home", page: "home", category: "all" as Category },
  { label: "Electronics", page: "home", category: "electronics" as Category },
  {
    label: "Fashion (Men)",
    page: "home",
    category: "mens-clothing" as Category,
  },
  { label: "Women", page: "home", category: "dresses" as Category },
  {
    label: "Home & Living",
    page: "home",
    category: "home-appliances" as Category,
  },
  { label: "Beauty", page: "home", category: "beauty" as Category },
  { label: "Today's Deals", page: "home", category: "all" as Category },
];

const searchCategories = [
  "All",
  "Electronics",
  "Phones",
  "Laptops",
  "Fashion",
  "Beauty",
  "Sports",
  "Toys",
];

export function Header({
  cartItems,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  activePage,
  onNavigate,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  user,
  onLogin,
  onLogout,
}: HeaderProps) {
  const [searchCat, setSearchCat] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const triggerSearch = () => {
    const el = document.getElementById("product-grid-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") triggerSearch();
  };

  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        {/* Row 1 */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              onNavigate("home");
              onCategoryChange("all");
            }}
            className="flex items-center gap-2 shrink-0"
            data-ocid="header.link"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ShopZone</span>
          </button>

          <div className="flex-1 hidden md:flex items-center border border-border rounded-lg overflow-hidden max-w-2xl">
            <select
              value={searchCat}
              onChange={(e) => setSearchCat(e.target.value)}
              className="px-3 py-2 text-sm bg-muted border-r border-border text-foreground outline-none cursor-pointer"
            >
              {searchCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="flex-1 px-3 py-2 text-sm outline-none text-foreground placeholder:text-muted-foreground"
              data-ocid="header.search_input"
            />
            <button
              type="button"
              onClick={triggerSearch}
              className="px-4 py-2 bg-primary text-white flex items-center gap-1 hover:opacity-90 transition-opacity"
              data-ocid="header.button"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 ml-auto md:ml-0">
            {/* Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hidden md:flex flex-col items-center gap-0.5 text-primary transition-colors"
                    data-ocid="header.dropdown_menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {firstName[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs flex items-center gap-0.5">
                      {firstName}
                      <ChevronDown className="w-3 h-3" />
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                    data-ocid="header.button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="hidden md:flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors"
                data-ocid="header.open_modal_button"
              >
                <User className="w-5 h-5" />
                <span className="text-xs">Account</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors"
              data-ocid="header.open_modal_button"
            >
              <Heart className="w-5 h-5" />
              <span className="text-xs hidden md:block">Wishlist</span>
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-white">
                  {wishlistCount}
                </Badge>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              data-ocid="header.open_modal_button"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-white">
                    {cartCount}
                  </Badge>
                )}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {cartCount > 0 ? `$${cartTotal.toFixed(2)}` : "Cart"}
              </span>
            </button>

            <button
              type="button"
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Nav */}
        <nav className="hidden md:block border-t border-border bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  activePage === link.page &&
                  (link.label === "Home"
                    ? activeCategory === "all"
                    : activeCategory === link.category);
                return (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate(link.page);
                        onCategoryChange(link.category);
                      }}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-primary hover:border-primary/40"
                      }`}
                      data-ocid="header.tab"
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
              <li className="ml-auto">
                <button
                  type="button"
                  onClick={() => onNavigate("orders")}
                  className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activePage === "orders"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-primary"
                  }`}
                  data-ocid="nav.orders_link"
                >
                  My Orders
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border">
            <div className="px-4 py-2">
              <div className="flex items-center border border-border rounded-lg overflow-hidden mb-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      triggerSearch();
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm outline-none"
                  data-ocid="mobile.search_input"
                />
                <button
                  type="button"
                  onClick={() => {
                    triggerSearch();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-white"
                  data-ocid="mobile.button"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile account */}
              {user ? (
                <div className="flex items-center justify-between py-2 px-2 mb-1 rounded-lg bg-primary/5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-destructive font-semibold flex items-center gap-1"
                    data-ocid="mobile.button"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-2 text-sm text-primary font-semibold hover:bg-primary/5 rounded-lg mb-1"
                  data-ocid="mobile.open_modal_button"
                >
                  <User className="w-4 h-4 inline mr-1" />
                  Login / Sign Up
                </button>
              )}

              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    onNavigate(link.page);
                    onCategoryChange(link.category);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-2 text-sm text-foreground hover:text-primary"
                  data-ocid="mobile.link"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={onLogin}
      />
    </>
  );
}
