import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Shield, ShoppingBasket, Sprout } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Home() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { userRole, isLoading } = useAuth();

  useEffect(() => {
    if (identity && !isLoading && userRole) {
      // Redirect authenticated users to their dashboard
      if (userRole === "admin") {
        navigate({ to: "/admin" });
      } else if (userRole === "user") {
        // Default to buyer dashboard for regular users
        navigate({ to: "/buyer" });
      }
    }
  }, [identity, userRole, isLoading, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(/assets/generated/hero-farm.dim_1920x600.png)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Smart Farmer Marketplace
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Connecting farmers directly with buyers. Fresh produce, fair prices,
            no middlemen.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-earth-green hover:bg-earth-green/90 text-white px-8 py-6 text-lg"
              onClick={() => navigate({ to: "/buyer" })}
            >
              Browse Products
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 px-8 py-6 text-lg"
              onClick={() => navigate({ to: "/farmer" })}
            >
              Sell Your Produce
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Three simple roles, one powerful marketplace
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-earth-green transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-earth-green/10 rounded-full flex items-center justify-center mb-4">
                  <Sprout className="w-8 h-8 text-earth-green" />
                </div>
                <CardTitle className="text-2xl">For Farmers</CardTitle>
                <CardDescription className="text-base">
                  List your products, manage orders, and grow your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Add products with photos and descriptions</li>
                  <li>• Set your own prices</li>
                  <li>• Track orders and earnings</li>
                  <li>• Build your reputation with reviews</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-harvest-yellow transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-harvest-yellow/10 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBasket className="w-8 h-8 text-harvest-yellow" />
                </div>
                <CardTitle className="text-2xl">For Buyers</CardTitle>
                <CardDescription className="text-base">
                  Discover fresh produce directly from local farmers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Browse quality agricultural products</li>
                  <li>• Search and filter by your needs</li>
                  <li>• Place orders with ease</li>
                  <li>• Rate and review products</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-warm-brown transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-warm-brown/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-warm-brown" />
                </div>
                <CardTitle className="text-2xl">For Admins</CardTitle>
                <CardDescription className="text-base">
                  Oversee the marketplace and ensure quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Monitor all marketplace activity</li>
                  <li>• Manage users and products</li>
                  <li>• View analytics and insights</li>
                  <li>• Maintain platform integrity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-earth-green text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-green-50">
            Join our community of farmers and buyers today. No fees, no
            middlemen, just honest trade.
          </p>
          <Button
            size="lg"
            className="bg-white text-earth-green hover:bg-gray-100 px-8 py-6 text-lg"
            onClick={() => navigate({ to: "/buyer" })}
          >
            Explore Marketplace
          </Button>
        </div>
      </section>
    </div>
  );
}
