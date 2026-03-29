"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Sembunyikan navbar jika URL berawalan /admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <>{children}</>;
}
