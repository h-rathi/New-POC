const prisma = require("../utills/db");

/**
 * Calculates the discounted price based on original price, discount type, and value.
 * Ensures the final price never drops below 0.
 */
function calculateDiscountedPrice(originalPrice, discountType, discountValue) {
  let discountedPrice = originalPrice;

  if (discountType === "PERCENTAGE") {
    // e.g., 10% off of 1000 = 1000 - (1000 * 10 / 100) = 900
    discountedPrice = originalPrice - (originalPrice * discountValue) / 100;
  } else if (discountType === "FIXED") {
    // e.g., $10 off of 100 = 90
    discountedPrice = originalPrice - discountValue;
  }

  // Ensure price doesn't go below 0
  return Math.max(0, Math.round(discountedPrice));
}

/**
 * Global Helper: applies active offers to an array of products.
 * Returns exactly the same products but enriched with:
 * { price, discountedPrice, hasDiscount }
 * 
 * Supports both product-level and category-level offers.
 */
const applyOffersToProducts = async (products) => {
  if (!products || products.length === 0) return products;

  const currentDate = new Date();

  // 1. Fetch only ACTIVE offers
  const activeOffers = await prisma.offer.findMany({
    where: {
      isActive: true,
      startDate: { lte: currentDate },
      endDate: { gte: currentDate },
    },
    include: {
      offerProducts: true,
    },
  });

  // If no active offers, just mark all products as un-discounted and return early
  if (activeOffers.length === 0) {
    return products.map(product => ({
      ...product,
      discountedPrice: product.price,
      hasDiscount: false,
    }));
  }

  // 2. Iterate through products and calculate best discount
  return products.map(product => {
    let bestOfferInfo = null;
    let bestDiscountedPrice = product.price; // Start with the original price

    activeOffers.forEach((offer) => {
      // Check if offer applies to this product
      const appliesToProduct = offer.offerProducts.some(
        (op) => op.productId === product.id || op.categoryId === product.categoryId
      );

      if (appliesToProduct) {
        const currentDiscountedPrice = calculateDiscountedPrice(
          product.price,
          offer.discountType,
          offer.discountValue
        );

        // Keep the lowest price if product matches multiple offers
        if (currentDiscountedPrice < bestDiscountedPrice) {
          bestDiscountedPrice = currentDiscountedPrice;
          bestOfferInfo = {
            offerName: offer.name,
            discountType: offer.discountType,
            discountValue: offer.discountValue
          };
        }
      }
    });

    if (bestOfferInfo) {
      return {
        ...product,
        discountedPrice: bestDiscountedPrice,
        hasDiscount: true,
        offerName: bestOfferInfo.offerName,
        discountType: bestOfferInfo.discountType,
        discountValue: bestOfferInfo.discountValue,
      };
    } else {
      return {
        ...product,
        discountedPrice: product.price,
        hasDiscount: false,
      };
    }
  });
};

/**
 * Helper to get arrays of targeted Product IDs and Category IDs that currently have active offers.
 * Used for natively filtering products by discount status down the stack.
 */
const getActiveOfferTargetIds = async () => {
  const currentDate = new Date();

  const activeOffers = await prisma.offer.findMany({
    where: {
      isActive: true,
      startDate: { lte: currentDate },
      endDate: { gte: currentDate },
    },
    include: { offerProducts: true },
  });

  const targetedProductIds = new Set();
  const targetedCategoryIds = new Set();

  activeOffers.forEach((offer) => {
    offer.offerProducts.forEach((op) => {
      if (op.productId) targetedProductIds.add(op.productId);
      if (op.categoryId) targetedCategoryIds.add(op.categoryId);
    });
  });

  return {
    targetedProductIds: Array.from(targetedProductIds),
    targetedCategoryIds: Array.from(targetedCategoryIds),
  };
};

module.exports = {
  applyOffersToProducts,
  getActiveOfferTargetIds,
};
