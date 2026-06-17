// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1 (PostHog tracking added)
// *********************

"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import posthog from "posthog-js";
import { getIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

const Header = () => {
  const { data: session } = useSession();
  const isLoggedIn = getIsLoggedInValue(session);
  const pathname = usePathname();
  const { wishlist, setWishlist } = useWishlistStore();
  const isCheckoutPage = pathname === "/checkout";

  const handleLogout = () => {
    posthog.capture("header_logout_clicked", withIsLoggedIn({
      action: "GNB_interaction",
      component: "Header",
      location: pathname.startsWith("/admin") ? "admin" : "user",
    }, isLoggedIn));

    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  const getWishlistByUserId = async (id: string) => {
    const response = await apiClient.get(`/api/wishlist/${id}`, {
      cache: "no-store",
    });

    return; // wishlist fetching disabled
  };

  const getUserByEmail = async () => {
    if (session?.user?.email) {
      apiClient
        .get(`/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        })
        .then((response) => response.json())
        .then((data) => {
          getWishlistByUserId(data?.id);
        });
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email, wishlist.length]);

  const trackLogoClick = (area: "user" | "admin") => {
  const payload = withIsLoggedIn({
    area,
    component: "Header",
  }, isLoggedIn);

  posthog.capture("header_logo_clicked", payload);

  // 🔹 GTM dataLayer push (NEW)
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "header_logo_clicked",
      ...payload,
    });
  }
};

  const trackAdminMenuClick = (label: string) => {
    posthog.capture("admin_menu_clicked", withIsLoggedIn({
      label,
      component: "Header",
    }, isLoggedIn));
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <HeaderTop />

      {isCheckoutPage && <div className="h-6 bg-white" aria-hidden="true" />}

      {/* USER HEADER */}
      {pathname.startsWith("/admin") === false && !isCheckoutPage && (
        <div className="bg-white flex flex-wrap items-center justify-between px-4 sm:px-6 lg:px-16 py-3 lg:h-32 gap-y-3 max-w-screen-2xl mx-auto w-full">
          <Link href="/" onClick={() => trackLogoClick("user")} className="flex-shrink-0">
            <img
              src="/logo v1 svg.svg"
              width={300}
              height={300}
              alt="singitronic logo"
              className="w-32 sm:w-48 lg:w-64 lg:relative lg:right-5"
            />
          </Link>

          <div className="flex gap-x-4 sm:gap-x-10 items-center order-2 lg:order-3">
            <NotificationBell />
            <CartElement />
          </div>

          <div className="w-full lg:w-auto lg:flex-1 lg:mx-8 order-3 lg:order-2">
            <SearchInput />
          </div>
        </div>
      )}

      {/* ADMIN HEADER */}
      {pathname.startsWith("/admin") === true && (
        <div className="flex flex-wrap justify-between items-center px-4 sm:px-6 lg:px-16 py-3 lg:h-32 bg-white max-w-screen-2xl mx-auto w-full">
          <Link href="/" onClick={() => trackLogoClick("admin")}>
            <Image
              src="/logo v1.png"
              width={130}
              height={130}
              alt="singitronic logo"
              className="w-40 sm:w-56 h-auto"
            />
          </Link>

          <div className="flex gap-x-3 sm:gap-x-5 items-center mt-2 sm:mt-0">
            <NotificationBell />

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10">
                <Image
                  src="/randomuser.jpg"
                  alt="random profile photo"
                  width={30}
                  height={30}
                  className="w-full h-full rounded-full"
                />
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link
                    href="/admin"
                    onClick={() => trackAdminMenuClick("Dashboard")}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a onClick={() => trackAdminMenuClick("Profile")}>
                    Profile
                  </a>
                </li>
                <li onClick={handleLogout}>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
