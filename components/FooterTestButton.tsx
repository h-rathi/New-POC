"use client";

import { track } from "@/lib/track";

export default function FooterTestButton({ pageName }: { pageName: string }) {
  const handleClick = async () => {
    await track("Footer button clicked", {
      page: pageName,
      source: "footer_section_page",
    });
  };

  return (
    <button
      id="footer-test-btn"
      onClick={handleClick}
      className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all"
    >
      Footer button clicked
    </button>
  );
}
