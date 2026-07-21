"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className={`flex-1 flex flex-col ${isHome ? "pt-0" : "pt-28 md:pt-36"}`}>
      {children}
    </main>
  );
}
