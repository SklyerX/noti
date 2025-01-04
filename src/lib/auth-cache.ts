import type { User } from "@/db/schema";

const CACHE_KEY = "auth::user";
const CACHE_TTL = 1000 * 60 * 5;

interface CacheEntry {
  user: User | null;
  timestamp: number;
}

export function getCachedUser(): CacheEntry | null {
  try {
    const cachedUser = localStorage.getItem(CACHE_KEY);

    if (!cachedUser) {
      return null;
    }

    const { user, timestamp } = JSON.parse(cachedUser);

    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return { user, timestamp };
  } catch {
    return null;
  }
}

export function setCachedUser(user: User | null): void {
  try {
    const entry: CacheEntry = { user, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {}
}
