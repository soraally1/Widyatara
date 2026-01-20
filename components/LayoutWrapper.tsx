"use client";

import React, { ReactNode } from "react";
import { useTransitionContext } from "./TransitionContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

// Some pages might not want global navbar/footer if needed,
// but for now we assume global usage.

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const { isAnimating } = useTransitionContext();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isNoNavPage = pathname === "/" || pathname === "/Papua";

  if (isAuthPage || isNoNavPage) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`transition-opacity duration-500 ${isAnimating ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
        <Navbar />
      </div>

      {children}

      <div
        className={`transition-opacity duration-500 ${isAnimating ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
        <Footer />
      </div>
    </>
  );
}
