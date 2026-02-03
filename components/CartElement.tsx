// *********************
// Role of the component: Cart icon and quantity that will be located in the header
// Name of the component: CartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1 (PostHog tracking added)
// *********************

"use client";

import Link from 'next/link'
import React from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { useProductStore } from "@/app/_zustand/store"
import posthog from 'posthog-js'

const CartElement = () => {
  const { allQuantity } = useProductStore()

  const handleCartClick = () => {
    posthog.capture('cart_icon_clicked', {
      cart_quantity: allQuantity,
      component: 'CartElement',
      destination: '/cart',
    })
  }

  return (
    <div className="relative">
      <Link
        href="/cart"
        onClick={handleCartClick}
      >
        <FaCartShopping className="text-2xl text-black" />
        <span className="block w-6 h-6 bg-blue-600 text-white rounded-full flex justify-center items-center absolute top-[-17px] right-[-22px]">
          {allQuantity}
        </span>
      </Link>
    </div>
  )
}

export default CartElement