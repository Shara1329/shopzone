import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Principal } from "@icp-sdk/core/principal";
import { Users } from "lucide-react";
import type { UserProfile } from "../../backend";

interface UserManagementProps {
  users: [Principal, UserProfile][];
}

export default function UserManagement({ users }: UserManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No users found
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Principal ID</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(([principal, profile]) => (
                <TableRow key={principal.toString()}>
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {principal.toString().slice(0, 20)}...
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        profile.role === "admin" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {profile.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
