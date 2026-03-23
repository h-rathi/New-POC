const prisma = require("../utills/db"); // ✅ Use shared connection
const { applyOffersToProducts } = require("../services/pricingService");

async function getProductBySlug(request, response) {
  const { slug } = request.params;
  const product = await prisma.product.findMany({
    where: {
      OR: [
        { slug: slug },
        { id: slug },
      ]
    },
    include: {
      category: true
    },
  });

  const foundProduct = product[0]; // Assuming there's only one product with that slug
  if (!foundProduct) {
    return response.status(404).json({ error: "Product not found" });
  }

  // Pass it as an array to the global formatter to maintain identical schema enrichment
  const formattedProductResult = await applyOffersToProducts([foundProduct]);

  return response.status(200).json(formattedProductResult[0]);
}

module.exports = { getProductBySlug };
