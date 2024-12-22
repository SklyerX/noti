import type { ReactNode } from "react";
import Navigation from "./_components/navigation";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <Navigation />
      <div className="grid gap-6">{children}</div>
    </div>
  );
}
