import "server-only";

export function getBaseUrl(): string {
  const isProduction = process.env.NODE_ENV === "production";
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  return isProduction && vercelUrl
    ? `https://${vercelUrl}`
    : "http://localhost:3000";
}
