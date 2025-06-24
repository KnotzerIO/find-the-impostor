"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ThemeColor() {
  const pathname = usePathname();

  useEffect(() => {
    const color = pathname === "/" ? "#07090a" : "#000000";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);
  }, [pathname]);

  return null;
}
