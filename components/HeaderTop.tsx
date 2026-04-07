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
    <div className="h-10 text-white bg-blue-500 max-lg:px-5 max-lg:h-16 max-[573px]:px-0">
      <div className="flex justify-between h-full max-lg:flex-col max-lg:justify-center max-lg:items-center max-w-screen-2xl mx-auto px-12 max-[573px]:px-0">
        
        {/* Auth links */}
        <ul className="flex items-center gap-x-5 h-full max-[370px]:text-sm max-[370px]:gap-x-2 font-semibold">
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
              <span className="ml-10 text-base">
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