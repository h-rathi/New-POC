// *********************
// Role of the component: Custom button component
// Name of the component: CustomButton.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1 (PostHog tracking added)
// *********************

"use client";

import React from "react";
import posthog from "posthog-js";
import { useIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

interface CustomButtonProps {
  paddingX: number;
  paddingY: number;
  text: string;
  buttonType: "submit" | "reset" | "button";
  customWidth: string;
  textSize: string;
  disabled?: boolean;
}

const CustomButton = ({
  paddingX,
  paddingY,
  text,
  buttonType,
  customWidth,
  textSize,
  disabled,
}: CustomButtonProps) => {
  const isLoggedIn = useIsLoggedInValue();

  const handleClick = () => {
    posthog.capture("custom_button_clicked", withIsLoggedIn({
      label: text,
      button_type: buttonType,
      width: customWidth,
      text_size: textSize,
      component: "CustomButton",
    }, isLoggedIn));
  };

  return (
    <button
      type={buttonType}
      onClick={handleClick}
      disabled={disabled}
      className={`${customWidth !== "no" && `w-${customWidth}`} uppercase bg-white px-${paddingX} py-${paddingY} text-${textSize} border border-black border-gray-300 font-bold text-blue-600 shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2'}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
