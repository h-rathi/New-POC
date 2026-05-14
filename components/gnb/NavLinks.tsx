"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MegaMenu from "./MegaMenu";
import ProductDropdown from "./ProductDropdown";

const mainCategories = [
  { name: "Shop", href: "/shop", hasMegaMenu: true },
  { name: "Offers", href: "/offers", highlight: true },
  { name: "Laptops", href: "/shop?category=laptops", isDynamic: true, categorySlug: "laptops" },
  { name: "Tablets", href: "/shop?category=tablets", isDynamic: true, categorySlug: "tablets" },
  { name: "Cameras", href: "/shop?category=cameras", isDynamic: true, categorySlug: "cameras" },
  { name: "Earbuds", href: "/shop?category=earbuds", isDynamic: true, categorySlug: "earbuds" },
  { name: "Printers", href: "/shop?category=printers", isDynamic: true, categorySlug: "printers" },
];

export default function NavLinks() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCategory(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ul ref={navRef} className="hidden lg:flex items-center gap-x-8 h-full">
      {mainCategories.map((cat, idx) => {
        const isActive = activeCategory === cat.name;

        return (
          <li 
            key={idx} 
            className="static h-full flex items-center group"
            onMouseEnter={() => setActiveCategory(cat.name)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <Link
              href={cat.href}
              onClick={() => setActiveCategory(null)}
              className={`text-[15px] font-medium transition-colors duration-300 relative py-5 flex items-center h-full ${
                cat.highlight ? "text-blue-600 font-semibold" : "text-gray-800 hover:text-black"
              }`}
            >
              {cat.name}
              {/* Hover bottom border animation */}
              <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-black transition-transform duration-300 origin-center ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </Link>
            
            {cat.hasMegaMenu && (
               <MegaMenu label={cat.name} />
            )}
            
            {cat.isDynamic && (
                 <ProductDropdown 
                   category={cat.categorySlug!} 
                   isActive={isActive}
                   onClose={() => setActiveCategory(null)} 
                 />
            )}
          </li>
        );
      })}
    </ul>
  );
}
