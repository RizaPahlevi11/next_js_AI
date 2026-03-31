"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Sembunyikan navbar jika URL berawalan /admin atau route auth (/login, /register)
  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return <>{children}</>;
}
