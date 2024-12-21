import { useEffect, useCallback } from "react";
import { useAuthStore, type UserPlan } from "@/store/auth";
import type { User } from "@/db/schema";

let cachedUser: { user: UserPlan; timestamp: number } | null = null;
const CACHE_DURATION = 1000 * 60;

export function useAuth() {
  const store = useAuthStore();

  const validateSession = useCallback(async () => {
    if (cachedUser && Date.now() - cachedUser.timestamp < CACHE_DURATION) {
      store.setUser(cachedUser.user);
      return;
    }

    store.setLoading(true);

    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Invalid session");

      const user = await res.json();

      if (user) {
        cachedUser = { user, timestamp: Date.now() };
        store.setUser(user);
      } else {
        cachedUser = null;
        store.reset();
      }
    } catch (error) {
      cachedUser = null;
      store.reset();
    } finally {
      store.setLoading(false);
    }
  }, []);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
  };
}
