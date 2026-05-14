"use client";

import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { sanitize } from "@/lib/sanitize";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();
  const isLoggedIn = useIsLoggedInValue();
  const [isPending, startTransition] = useTransition();

  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const sanitizedSearch = sanitize(searchInput);

    posthog.capture("search_performed", withIsLoggedIn({
      action: "GNB_interaction",
      query: sanitizedSearch,
      query_length: sanitizedSearch.length,
      component: "SearchBar",
      source: "header",
    }, isLoggedIn));

    startTransition(() => {
      router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
      setSearchInput("");
    });
  };

  return (
    <form
      className="relative flex items-center group w-full sm:w-[200px] focus-within:w-[260px] transition-all duration-300 ease-in-out hidden md:flex"
      onSubmit={searchProducts}
    >
      <div className="absolute left-3 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors flex items-center justify-center">
        {isPending ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        )}
      </div>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search products..."
        className="w-full h-10 pl-10 pr-4 text-sm bg-gray-100 border border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
      />
    </form>
  );
}
