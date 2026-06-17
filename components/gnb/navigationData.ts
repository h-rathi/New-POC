export const mainCategories = [
  { name: "Shop", href: "/shop", hasMegaMenu: true },
  { name: "Offers", href: "/offers", highlight: true },
  { name: "Laptops", href: "/shop?category=laptops", isDynamic: true, categorySlug: "laptops" },
  { name: "Tablets", href: "/shop?category=tablets", isDynamic: true, categorySlug: "tablets" },
  { name: "Cameras", href: "/shop?category=cameras", isDynamic: true, categorySlug: "cameras" },
  { name: "Earbuds", href: "/shop?category=earbuds", isDynamic: true, categorySlug: "earbuds" },
  { name: "Printers", href: "/shop?category=printers", isDynamic: true, categorySlug: "printers" },
];

export const mlpCategoryLinks: Record<string, { title: string; slug: string; tagline: string; glow: string }[]> = {
  laptops: [
    { title: "MacBook Air M3", slug: "macbook-air-m3", tagline: "Power meets portability", glow: "hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] hover:border-blue-200" },
    { title: "ThinkPad X1", slug: "lenovo-thinkpad-x1", tagline: "Enterprise grade performance", glow: "hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] hover:border-blue-200" }
  ],
  tablets: [
    { title: "Xiaomi Pad 6", slug: "xiaomi-pad-6", tagline: "Immersive entertainment", glow: "hover:shadow-[0_8px_30px_rgba(107,114,128,0.12)] hover:border-gray-300" },
    { title: "Lenovo Tab P12", slug: "lenovo-tab-p12", tagline: "Pro-level productivity", glow: "hover:shadow-[0_8px_30px_rgba(107,114,128,0.12)] hover:border-gray-300" }
  ],
  cameras: [
    { title: "Sony Alpha a6400", slug: "sony-alpha-a6400", tagline: "Capture the moment", glow: "hover:shadow-[0_8px_30px_rgba(234,88,12,0.12)] hover:border-orange-200" },
    { title: "Canon EOS R50", slug: "canon-eos-r50", tagline: "Next-gen creator tool", glow: "hover:shadow-[0_8px_30px_rgba(234,88,12,0.12)] hover:border-orange-200" }
  ],
  earbuds: [
    { title: "Sony WF-1000XM5", slug: "sony-wf-1000xm5", tagline: "Premium noise cancellation", glow: "hover:shadow-[0_8px_30px_rgba(147,51,234,0.12)] hover:border-purple-200" },
    { title: "OnePlus Buds Pro 3", slug: "oneplus-buds-pro-3", tagline: "Masterful audio", glow: "hover:shadow-[0_8px_30px_rgba(8,145,178,0.12)] hover:border-cyan-200" }
  ],
  printers: [
    { title: "Brother HL-L2321D", slug: "brother-hl-l2321d", tagline: "Fast & reliable printing", glow: "hover:shadow-[0_8px_30px_rgba(8,145,178,0.12)] hover:border-cyan-200" },
    { title: "Canon Pixma G3020", slug: "canon-pixma-g3020", tagline: "Smart productivity", glow: "hover:shadow-[0_8px_30px_rgba(8,145,178,0.12)] hover:border-cyan-200" }
  ]
};
