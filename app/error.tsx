"use client";

import { AiOutlineWarning } from "react-icons/ai";
import { useEffect } from "react";
import posthog from "posthog-js";

const GlobalError = ({ error }: { error: Error }) => {

  useEffect(() => {
    posthog.capture("app_crash", {
      crash_type: "react_component_error",
      error_message: error.message,
      error_stack: error.stack ?? "no stack available",
      platform: "android",
      occurred_at: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center p-6 rounded-2xl bg-red-50 border border-red-200 shadow-sm">
      <AiOutlineWarning className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-2xl font-semibold text-red-700">Something went wrong</h3>
      <p className="text-red-500 mt-3 max-w-md">{error.message}</p>
    </div>
  );
};

export default GlobalError;