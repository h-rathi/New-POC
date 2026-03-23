
import {
  SectionTitle
} from "@/components";
import { Loader } from "@/components/Loader";
import { CartModule } from "@/components/modules/cart";
import { Suspense } from "react";
import Link from "next/link";

const CartPage = () => {
  return (
    <div className="bg-white">
      <SectionTitle
        title="Cart Page"
        path={
          <>
            <Link href="/" className="hover:text-blue-200 transition-colors">Home</Link>
            <span className="mx-2">|</span>
            <span className="opacity-75">Cart</span>
          </>
        }
      />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <Suspense fallback={<Loader />}>
            <CartModule />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
