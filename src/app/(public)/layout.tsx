import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      navnar
      {children}
    </div>
  );
}
