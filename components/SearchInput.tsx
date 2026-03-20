// *********************
// Role of the component: Search input element located in the header but it can be used anywhere in your application
// Name of the component: SearchInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1 (PostHog tracking added)
// *********************

"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sanitize } from "@/lib/sanitize";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();
  const isLoggedIn = useIsLoggedInValue();

  // function for modifying URL for searching products
  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sanitizedSearch = sanitize(searchInput);

    // 🔹 Analytics
    posthog.capture("search_performed", withIsLoggedIn({
      action: "GNB_interaction",
      query: sanitizedSearch,
      query_length: sanitizedSearch.length,
      component: "SearchInput",
      source: "header",
    }, isLoggedIn));

    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    setSearchInput("");
  };

  return (
    <form className="flex w-full justify-center" onSubmit={searchProducts}>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Type here"
        className="bg-gray-50 input input-bordered w-[70%] rounded-r-none outline-none focus:outline-none max-sm:w-full"
      />
      <button
        type="submit"
        className="btn bg-blue-500 text-white rounded-l-none rounded-r-xl hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
