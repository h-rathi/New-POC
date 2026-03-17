const prisma = require("../utills/db");
const { applyOffersToProducts } = require("./pricingService");

/**
 * Fetches products that have active offers applied, returning an array of:
 * [{ "productId": "uuid", "price": 10000, "discountedPrice": 8500 }]
 */
const getActiveOffers = async () => {
  const currentDate = new Date();

  // 1. Fetch only ACTIVE offers where current date is between start and end dates
  const activeOffers = await prisma.offer.findMany({
    where: {
      isActive: true,
      startDate: { lte: currentDate },
      endDate: { gte: currentDate },
    },
    include: {
      offerProducts: true, // Includes associated productIds and categoryIds
    },
  });

  if (activeOffers.length === 0) {
    return [];
  }

  // 2. Collect all target Product IDs and Category IDs from active offers
  const targetedProductIds = new Set();
  const targetedCategoryIds = new Set();

  activeOffers.forEach((offer) => {
    offer.offerProducts.forEach((op) => {
      if (op.productId) targetedProductIds.add(op.productId);
      if (op.categoryId) targetedCategoryIds.add(op.categoryId);
    });
  });

  // 3. Fetch all products that match either the specific Product IDs OR Category IDs
  const rawProducts = await prisma.product.findMany({
    where: {
      OR: [
        { id: { in: Array.from(targetedProductIds) } },
        { categoryId: { in: Array.from(targetedCategoryIds) } },
      ],
    },
    select: {
      id: true,
      price: true,
      categoryId: true,
    },
  });

  if (rawProducts.length === 0) {
    return [];
  }

  // 4. Run products through the centralized pricing service
  const processedProducts = await applyOffersToProducts(rawProducts);

  // 5. Filter only those that actually received a discount and format the response
  const responseData = processedProducts
    .filter((p) => p.hasDiscount)
    .map((p) => ({
      productId: p.id,
      price: p.price,
      discountedPrice: p.discountedPrice,
      hasDiscount: p.hasDiscount,
      offerName: p.offerName,
      discountType: p.discountType,
      discountValue: p.discountValue
    }));

  return responseData;
};

module.exports = {
  getActiveOffers,
};
