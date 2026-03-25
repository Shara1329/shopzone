import { useQuery } from "@tanstack/react-query";
import type { UserProfile, UserRole } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useAuth() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();

  const roleQuery = useQuery<UserRole>({
    queryKey: ["userRole", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !!identity && !actorFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
  });

  return {
    isAuthenticated: !!identity,
    userRole: roleQuery.data,
    userProfile: profileQuery.data,
    isLoading: actorFetching || roleQuery.isLoading || profileQuery.isLoading,
    profileLoading: profileQuery.isLoading,
    isFetched: profileQuery.isFetched,
  };
}
