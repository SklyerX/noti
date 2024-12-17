"use client";

import { useAuth } from "@/hooks/use-auth";

export default function Page() {
  const { user, isLoading } = useAuth();

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!user) {
  //   return <div>Not authenticated</div>;
  // }

  return (
    <div>
      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </div>
  );
}
