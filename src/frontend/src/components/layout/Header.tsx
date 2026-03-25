import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, Sprout } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import RoleBadge from "./RoleBadge";

export default function Header() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { userRole, userProfile } = useAuth();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const getDashboardPath = () => {
    if (userRole === "admin") return "/admin";
    return "/buyer";
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate({ to: "/" })}
        >
          <Sprout className="w-8 h-8 text-earth-green" />
          <span className="text-xl font-bold">Smart Farmer</span>
        </button>

        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" onClick={() => navigate({ to: "/buyer" })}>
            Browse Products
          </Button>
          {isAuthenticated && (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: getDashboardPath() })}
              >
                Dashboard
              </Button>
              {userRole !== "admin" && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate({ to: "/farmer" })}
                  >
                    Farmer Portal
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate({ to: "/buyer/orders" })}
                  >
                    My Orders
                  </Button>
                </>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile && userRole && (
            <div className="hidden md:flex items-center gap-2">
              <RoleBadge role={userRole} />
              <span className="text-sm font-medium">{userProfile.name}</span>
            </div>
          )}
          <Button
            onClick={handleAuth}
            disabled={disabled}
            className={
              isAuthenticated
                ? "bg-muted hover:bg-muted/80 text-foreground"
                : "bg-earth-green hover:bg-earth-green/90 text-white"
            }
          >
            {disabled ? (
              "Loading..."
            ) : isAuthenticated ? (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </>
            ) : (
              "Login"
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate({ to: "/buyer" })}>
                Browse Products
              </DropdownMenuItem>
              {isAuthenticated && (
                <>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: getDashboardPath() })}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  {userRole !== "admin" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/farmer" })}
                      >
                        Farmer Portal
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/buyer/orders" })}
                      >
                        My Orders
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  {userProfile && (
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{userProfile.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {userRole}
                      </div>
                    </div>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
