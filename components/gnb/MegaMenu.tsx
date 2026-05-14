"use client";

import React from "react";
import Link from "next/link";

interface MegaMenuProps {
  label: string;
}

export default function MegaMenu({ label }: MegaMenuProps) {
  const currentData = [
    { title: "Popular Items", links: ["Laptops", "Smartphones", "Accessories", "Audio"] },
    { title: "Trending Brands", links: ["Samsung", "Apple", "Dell", "Sony"] },
    { title: "New Arrivals", links: ["Smart Watches", "Gaming Consoles", "Drones"] },
  ];

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-16 max-md:px-6 py-10">
        <div className="grid grid-cols-5 gap-8">
          {currentData.map((col, idx) => (
            <div key={idx} className="flex flex-col gap-5">
              <h3 className="text-sm font-bold text-black tracking-wide uppercase">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-4">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <Link href={`/shop?category=${link.toLowerCase()}`} className="text-gray-500 hover:text-black hover:font-medium transition-all text-[15px]">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 flex flex-col justify-end bg-gray-50 p-6 rounded-2xl relative overflow-hidden min-h-[200px]">
             <div className="relative z-10 w-full text-center sm:text-left">
               <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full mb-3 inline-block">Special Offer</span>
               <h4 className="text-2xl font-bold text-gray-900 mb-2">Galaxy S24 Ultra</h4>
               <p className="text-sm text-gray-600 mb-4 max-w-xs">Experience the next level of mobile technology.</p>
               <Link href="#" className="text-sm font-bold text-black hover:underline underline-offset-4 pointer-events-auto">Shop now →</Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
