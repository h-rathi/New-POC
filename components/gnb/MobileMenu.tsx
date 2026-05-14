"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sanitize } from "@/lib/sanitize";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchInput.trim()) {
      startTransition(() => {
        router.push(`/search?search=${encodeURIComponent(sanitize(searchInput))}`);
        toggleMenu();
        setSearchInput("");
      });
    }
  };

  const mainCategories = [
    { name: "Shop", href: "/shop" },
    { name: "Offers", href: "/offers" },
    { name: "Laptops", href: "/shop?category=laptops" },
    { name: "Tablets", href: "/shop?category=tablets" },
    { name: "Earbuds", href: "/shop?category=earbuds" },
    { name: "Mouse", href: "/shop?category=mouse" },
    { name: "Printers", href: "/shop?category=printers" },
  ];

  return (
    <div className="lg:hidden flex items-center">
      <button onClick={toggleMenu} className="p-2 -mr-2 text-gray-800 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      ></div>
      
      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-bold tracking-widest text-black">MENU</span>
            <button onClick={toggleMenu} className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-8 block sm:hidden relative">
            <form onSubmit={handleSearch}>
              <div className="absolute left-3 top-3.5 text-gray-400 flex items-center justify-center">
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                )}
              </div>
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..." 
                className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </form>
          </div>

          <ul className="flex flex-col gap-6">
            {mainCategories.map((cat, idx) => (
              <li key={idx}>
                <Link
                  href={cat.href}
                  className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors"
                  onClick={toggleMenu}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <hr className="my-4 border-gray-100" />
            <li>
              <Link href="/login" onClick={toggleMenu} className="text-gray-600 font-medium hover:text-black">Login / Register</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
