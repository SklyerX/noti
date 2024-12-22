import DashboardNav from "@/components/dashboard-nav";
import type { User } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default async function NavbarLayout({ children }: Props) {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardNav user={user as User} />
      <div className="mx-auto container mt-10">{children}</div>
    </>
  );
}
