import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    window.location.hostname || "smart-farmer-marketplace",
  );

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3 text-earth-green">For Farmers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>List your products</li>
              <li>Manage orders</li>
              <li>Track earnings</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-harvest-yellow">
              For Buyers
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Browse fresh produce</li>
              <li>Direct from farmers</li>
              <li>Fair prices</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-warm-brown">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>No middlemen</li>
              <li>Secure platform</li>
              <li>Community driven</li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © {currentYear} Smart Farmer Marketplace. Built with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
