import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

interface AccessDeniedProps {
  message?: string;
}

export default function AccessDenied({
  message = "Access Denied",
}: AccessDeniedProps) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="bg-earth-green hover:bg-earth-green/90"
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
