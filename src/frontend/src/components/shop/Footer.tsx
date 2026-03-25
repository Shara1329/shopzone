import { Facebook, Instagram, Mail, ShoppingBag, Twitter } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">ShopZone</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Your one-stop destination for electronics, fashion, beauty, and
              everything in between. Quality products at unbeatable prices.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                data-ocid="footer.link"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                data-ocid="footer.link"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                data-ocid="footer.link"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-white/80">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                "Home",
                "Today's Deals",
                "New Arrivals",
                "My Orders",
                "Track Order",
              ].map((link) => (
                <li key={link}>
                  <span
                    className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer"
                    data-ocid="footer.link"
                  >
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-white/80">
              Categories
            </h3>
            <ul className="space-y-2">
              {[
                "Electronics",
                "Phones",
                "Fashion",
                "Footwear",
                "Beauty",
                "Sports",
                "Toys",
              ].map((cat) => (
                <li key={cat}>
                  <span
                    className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer"
                    data-ocid="footer.link"
                  >
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-white/80">
              Newsletter
            </h3>
            <p className="text-sm text-white/60 mb-3">
              Get exclusive deals and new arrivals in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex overflow-hidden rounded-lg border border-white/20">
                <div className="flex items-center px-2 bg-white/10">
                  <Mail className="w-4 h-4 text-white/60" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                  data-ocid="footer.input"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                data-ocid="footer.submit_button"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Contact Us"].map(
              (item) => (
                <span
                  key={item}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
