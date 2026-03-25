import { Badge } from "@/components/ui/badge";
import type { UserRole } from "../../backend";

interface RoleBadgeProps {
  role: UserRole;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleDisplay = () => {
    switch (role) {
      case "admin":
        return {
          label: "Admin",
          icon: "/assets/generated/admin-icon.dim_64x64.png",
          color: "bg-warm-brown",
        };
      case "user":
        return {
          label: "User",
          icon: "/assets/generated/wheat-icon.dim_64x64.png",
          color: "bg-earth-green",
        };
      default:
        return {
          label: "Guest",
          icon: "/assets/generated/basket-icon.dim_64x64.png",
          color: "bg-muted",
        };
    }
  };

  const { label, icon, color } = getRoleDisplay();

  return (
    <Badge
      variant="secondary"
      className={`${color} text-white flex items-center gap-1`}
    >
      <img src={icon} alt={label} className="w-4 h-4" />
      {label}
    </Badge>
  );
}
