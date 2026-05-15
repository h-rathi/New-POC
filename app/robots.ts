import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/shop",
          "/shop/",
          "/product",
          "/product/",
          "/product-landing",
          "/product-landing/",
          "/cart",
          "/cart/",
          "/checkout",
          "/checkout/",
          "/login",
          "/login/",
          "/register",
          "/register/",
          "/about",
          "/about/",
          "/offers",
          "/offers/",
          "/sale",
          "/sale/",
          "/search",
          "/search/",
          "/support",
          "/support/",
          "/buying",
          "/buying/",
          "/notifications",
          "/notifications/",
          "/thank-you",
          "/thank-you/",
          "/api",
          "/api/",
        ],
      },
    ],
  };
}
