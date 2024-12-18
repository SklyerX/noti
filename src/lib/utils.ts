import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PLAN_LIMITS = {
  free: {
    maxProjects: 1,
    maxApiCalls: 100,
  },
  basic: {
    maxProjects: 10,
    maxApiCalls: 5000,
  },
  plus: {
    maxProjects: Number.POSITIVE_INFINITY,
    maxApiCalls: Number.POSITIVE_INFINITY,
  },
};
