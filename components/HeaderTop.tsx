// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.2 (GTM dataLayer added)
// *********************

"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaHeadphones, FaRegEnvelope, FaRegUser } from "react-icons/fa6";
import posthog from "posthog-js";
import { getIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

const HeaderTop = () => {
  const { data: session }: any = useSession();
  const isLoggedIn = getIsLoggedInValue(session);

  const handleLogout = () => {
    const logoutPayload = withIsLoggedIn({
      component: "HeaderTop",
    }, isLoggedIn);

    posthog.capture("header_top_logout_clicked", logoutPayload);

    // 🔹 GTM dataLayer push (NEW)
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "header_top_logout_clicked",
        ...logoutPayload,
      });
    }

    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  const trackAuthClick = (type: "login" | "register") => {
    const payload = withIsLoggedIn({
      component: "HeaderTop",
    }, isLoggedIn);

    posthog.capture(`header_top_${type}_clicked`, payload);

    // 🔹 GTM dataLayer push (NEW)
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: `header_top_${type}_clicked`,
        ...payload,
      });
    }
  };

  const trackContactClick = (type: "phone" | "email") => {
    posthog.capture("header_top_contact_clicked", withIsLoggedIn({
      contact_type: type,
      component: "HeaderTop",
    }, isLoggedIn));
  };

  return (
    <div className="w-full bg-blue-500 text-white py-2 px-4 sm:px-6 lg:px-8 min-h-[40px]">
      <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center h-full max-w-screen-2xl mx-auto gap-2">
        
        {/* Auth links */}
        <ul className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-5 text-xs sm:text-sm font-semibold">
          {!session ? (
            <>
              <li className="flex items-center">
                <Link
                  href="/login"
                  onClick={() => trackAuthClick("login")}
                  className="flex items-center gap-x-2 font-semibold"
                >
                  <FaRegUser className="text-white" />
                  <span>Login</span>
                </Link>
              </li>

              <li className="flex items-center">
                <Link
                  href="/register"
                  onClick={() => trackAuthClick("register")}
                  className="flex items-center gap-x-2 font-semibold"
                >
                  <FaRegUser className="text-white" />
                  <span>Register</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <span className="ml-2 sm:ml-4 text-xs sm:text-sm">
                {session.user?.email}
              </span>

              <li className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-2 font-semibold"
                >
                  <FaRegUser className="text-white" />
                  <span>Log out</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;