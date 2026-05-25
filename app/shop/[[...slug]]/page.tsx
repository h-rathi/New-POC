export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  Breadcrumb,
  Filters,
  Pagination,
  Products,
  SortBy,
} from "@/components";
import React from "react";
import { sanitize } from "@/lib/sanitize";

// improve readabillity of category text, for example category text "smart-watches" will be "smart watches"
const improveCategoryText = (text: string): string => {
  if (text.toLowerCase() === "mouses" || text.toLowerCase() === "mouse") {
    return "Mouse";
  }

  if (text.indexOf("-") !== -1) {
    let textArray = text.split("-");

    return textArray.join(" ");
  } else {
    return text;
  }
};

const ShopPage = async ({ params, searchParams }: { params: Promise<{ slug?: string[] }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  // Await both params and searchParams so that we can forward the
  // category slug down into the <Products /> component and also
  // display the heading correctly. In some client‑side navigations
  // the slug may be missing (prefetch/caching) so we also look at
  // searchParams as a fallback.
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  // pick the first segment of the catch‑all slug, if present
  let categorySlug: string | null = null;
  if (awaitedParams?.slug && awaitedParams.slug.length > 0) {
    categorySlug = awaitedParams.slug[0];
  }
  // fallback to explicit query parameter if someone ever uses
  // /shop?category=whatever (helps with manual testing)
  if (!categorySlug && typeof awaitedSearchParams.category === "string") {
    categorySlug = awaitedSearchParams.category;
  }

  return (
    <div className="text-black bg-white">
      <div className=" max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <Breadcrumb />
        <div className="grid grid-cols-[200px_1fr] gap-x-10 max-md:grid-cols-1 max-md:gap-y-5">
          <Filters />
          <div>
            <div className="flex justify-between items-center max-lg:flex-col max-lg:gap-y-5">
              <h2 className="text-2xl font-bold max-sm:text-xl max-[400px]:text-lg uppercase">
                {categorySlug && categorySlug.length > 0
                  ? sanitize(improveCategoryText(categorySlug))
                  : "All Products"}
              </h2>

              <SortBy />
            </div>
            <div className="divider"></div>
            {/* pass slug explicitly rather than raw params object */}
            <Products
              categorySlug={categorySlug}
              searchParams={awaitedSearchParams}
            />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
