export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Breadcrumb, OfferedProducts } from "@/components";
import React from "react";

const OffersPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const awaitedSearchParams = await searchParams;
  const offerId = awaitedSearchParams?.offerId as string | undefined;

  return (
    <div className="text-black bg-white">
      <div className=" max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <Breadcrumb />
        <div className="grid grid-cols-[1fr] gap-x-10 max-md:grid-cols-1 max-md:gap-y-5">
          <div>
            <div className="flex justify-between items-center max-lg:flex-col max-lg:gap-y-5">
              <h2 className="text-2xl font-bold max-sm:text-xl max-[400px]:text-lg uppercase">
                ACTIVE OFFERS
              </h2>
            </div>
            <div className="divider"></div>
            <OfferedProducts offerId={offerId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
