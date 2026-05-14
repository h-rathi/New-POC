"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import TopBar from "./TopBar";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import MobileMenu from "./MobileMenu";
import NotificationBell from "../NotificationBell";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const isLoggedIn = useIsLoggedInValue();
  const [scrolled, setScrolled] = useState(false);

  const isCheckoutPage = pathname === "/checkout";
  const isAdminPage = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const trackLogoClick = (area: "user" | "admin") => {
    posthog.capture("header_logo_clicked", withIsLoggedIn({
      action: "GNB_interaction",
      area,
      component: "Navbar",
    }, isLoggedIn));
  };

  const handleLogout = () => {
    signOut();
  }

  // Simplified Admin Header embedded or separated
  if (isAdminPage) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="flex justify-between items-center h-20 px-8 max-w-screen-2xl mx-auto">
          <Link href="/" onClick={() => trackLogoClick("admin")}>
            <Image
              src="/logo v1.png"
              width={160}
              height={48}
              alt="singitronic logo"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <div className="flex gap-x-5 items-center">
            <NotificationBell />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10">
                <Image src="/randomuser.jpg" width={40} height={40} alt="profile" className="w-full h-full rounded-full" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link href="/admin">Dashboard</Link></li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Show only the TopBar on the checkout page
  if (isCheckoutPage) {
    return (
      <header className="bg-white">
        <TopBar />
        <div className="h-6 bg-white" aria-hidden="true" />
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md bg-white/95 backdrop-blur-md" : "bg-white"}`}>
      <TopBar />

      <div className="relative w-full border-b border-gray-100 group/nav">
        <div className="flex items-center justify-between h-16 px-16 max-md:px-6 max-w-screen-2xl mx-auto">
          {/* Logo */}
          <Link href="/" onClick={() => trackLogoClick("user")}>
            <img
              src="/logo v1 svg.svg"
              alt="singitronic logo"
              className="h-10 w-auto object-contain max-md:h-8"
            />
          </Link>

          {/* Centered Navigation */}
          <div className="flex-1 flex justify-center ml-10">
            <NavLinks />
          </div>

          {/* Right side (Search + Cart + Mobile) */}
          <div className="flex items-center gap-x-4">
            <SearchBar />
            <NotificationBell />
            <CartIcon />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
