import { getCachedUser, setCachedUser } from "@/lib/auth-cache";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

let isInitialized = false;

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    if (isInitialized) return;
    isInitialized = true;

    async function initAuth() {
      try {
        const cachedUser = getCachedUser();
        if (cachedUser) {
          store.setUser(cachedUser.user);
          validateUser();
          return;
        }

        await validateUser();
      } catch (err) {
        store.setError(err instanceof Error ? err : new Error("Auth Error"));
      }
    }

    initAuth();
  }, []);

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
  };
}

async function validateUser() {
  const store = useAuthStore.getState();
  store.setLoading(true);

  try {
    const res = await fetch("/api/auth/session", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch session");

    const user = await res.json();
    store.setUser(user);
    setCachedUser(user);
  } catch (error) {
    store.setError(error instanceof Error ? error : new Error("Auth error"));
    setCachedUser(null);
  }
}
