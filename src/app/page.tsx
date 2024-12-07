import { getCurrentUser } from "@/lib/session";

export default async function Page() {
  const user = await getCurrentUser();
  const isSignedIn = !!user;

  return <>{isSignedIn && <h1>Hello {user.name}</h1>}</>;
}
