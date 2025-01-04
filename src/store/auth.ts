import { create } from "zustand";
import type { planTierEnum, User } from "@/db/schema";

export type UserPlan = User & {
  planTier: (typeof planTierEnum.enumValues)[number] | null;
};
interface AuthState {
  user: UserPlan | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;

  // Actions
  setUser: (user: UserPlan | null) => void;
  setError: (error: Error | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setError: (error) => set({ error, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({ user: null, isAuthenticated: false, isLoading: false, error: null }),
}));
