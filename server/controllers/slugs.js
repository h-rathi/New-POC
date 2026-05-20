const prisma = require("../utills/db"); // ✅ Use shared connection
const { applyOffersToProducts } = require("../services/pricingService");

// Helper function to normalize titles by removing the variant suffix
function getVariantGroupTitle(title) {
  if (!title) return "";
  return title.replace(/\s+Variant\s+\d+$/i, "").trim();
}

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
  const formattedProduct = formattedProductResult[0];

  // Variant Grouping Logic
  let variants = [];
  let variantGroupTitle = "";

  if (foundProduct.title && foundProduct.categoryId) {
    // Normalize the current product title
    variantGroupTitle = getVariantGroupTitle(foundProduct.title);

    // Fetch all products from the same category
    const categoryProducts = await prisma.product.findMany({
      where: {
        categoryId: foundProduct.categoryId
      },
      select: {
        id: true,
        slug: true,
        title: true,
        mainImage: true,
        price: true,
        inStock: true,
        manufacturer: true,
        variant_attributes: true
      }
    });

    // Normalize titles of all products and group those matching the normalized current title
    variants = categoryProducts.filter((p) => {
      return getVariantGroupTitle(p.title) === variantGroupTitle;
    });
  }

  // Return them as variants along with existing response fields intact
  const finalResponse = {
    ...formattedProduct,
    variants,
    variantGroupTitle
  };

  return response.status(200).json(finalResponse);
}

module.exports = { getProductBySlug };
