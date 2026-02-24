const { parse } = require("csv-parse/sync");

// Truncate error message to safe length (500 chars to be safe, even though schema uses @db.Text)
function truncateError(message, maxLength = 500) {
  if (!message) return null;
  const str = String(message);
  return str.length > maxLength ? str.substring(0, maxLength - 3) + "..." : str;
}

// Validate a single CSV row according to the Product schema constraints
function validateRow(row) {
  const errs = [];
  const clean = {};

  const title = String(row.title ?? "").trim();
  const slug = String(row.slug ?? "").trim();
  const price = Number(row.price);
  const categoryId = String(row.categoryId ?? "").trim();
  const inStock = Number(row.inStock ?? 0);

  if (!title) errs.push("title is required");
  if (!slug) errs.push("slug is required");
  if (!Number.isFinite(price) || price < 0)
    errs.push("price must be a non-negative number");
  if (!categoryId) errs.push("categoryId is required");
  if (!Number.isFinite(inStock) || inStock < 0)
    errs.push("inStock must be a non-negative number");

  if (errs.length) return { ok: false, error: errs.join(", ") };

  clean.title = title;
  clean.slug = slug;
  // Convert price to cents (integer) since schema uses Int
  clean.price = Math.floor(price/90);
  clean.categoryId = categoryId;
  clean.inStock = Math.floor(inStock); // Integer stock quantity

  clean.manufacturer = row.manufacturer
    ? String(row.manufacturer).trim()
    : null;
  clean.description = row.description ? String(row.description).trim() : null;
  clean.mainImage = row.mainImage ? String(row.mainImage).trim() : null;

  return { ok: true, data: clean };
}

async function parseCsvBufferToRows(buffer) {
  let text = buffer.toString("utf-8");
  // Remove BOM (Byte Order Mark) if present (UTF-8 BOM is EF BB BF)
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records;
}

function computeBatchStatus(successCount, errorCount) {
  if (successCount > 0 && errorCount === 0) return "COMPLETED";
  if (successCount > 0 && errorCount > 0) return "PARTIAL";
  if (successCount === 0 && errorCount > 0) return "FAILED";
  return "PENDING";
}

// Get default merchant ID (first active merchant)
async function getDefaultMerchantId(tx) {
  const merchant = await tx.merchant.findFirst({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!merchant) {
    throw new Error("No active merchant found. Please create a merchant first.");
  }
  return merchant.id;
}

// Create products + items for valid rows, error items for invalid
async function createBatchWithItems(tx, batchId, validRows, errorRows, merchantId = null) {
  // Get merchant ID - use provided one or get default
  let resolvedMerchantId = merchantId;
  if (!resolvedMerchantId) {
    resolvedMerchantId = await getDefaultMerchantId(tx);
  }

  const uniqueCategoryIds = [...new Set(validRows.map((r) => r.categoryId))];

  // Fetch categories by both ID and name (case-insensitive)
  const categories = await tx.category.findMany({
    where: {
      OR: [
        { id: { in: uniqueCategoryIds } },
        { name: { in: uniqueCategoryIds } },
      ],
    },
    select: { id: true, name: true },
  });

  // Create a map for both ID and name lookup
  const categoryMap = new Map();
  categories.forEach((cat) => {
    categoryMap.set(cat.id, cat.id); // UUID -> UUID
    categoryMap.set(cat.name.toLowerCase(), cat.id); // name -> UUID
  });

  let success = 0;
  let failed = 0;
  
  // Collect items to batch create at the end
  const itemsToCreate = [];

  // Pre-process rows to separate valid+resolved from invalid
  const rowsWithResolvedCategory = [];
  
  for (const row of validRows) {
    // Try to resolve categoryId (could be UUID or category name)
    const resolvedCategoryId =
      categoryMap.get(row.categoryId) ||
      categoryMap.get(row.categoryId.toLowerCase());

    if (!resolvedCategoryId) {
      itemsToCreate.push({
        batchId,
        title: row.title,
        slug: row.slug,
        price: row.price,
        manufacturer: row.manufacturer,
        description: row.description,
        mainImage: row.mainImage,
        categoryId: row.categoryId,
        inStock: row.inStock,
        status: "ERROR",
        error: truncateError(`Category not found: ${row.categoryId}`),
      });
      failed++;
      continue;
    }
    
    rowsWithResolvedCategory.push({ ...row, resolvedCategoryId });
  }

  // Batch create all products at once for better performance
  if (rowsWithResolvedCategory.length > 0) {
    const productsToCreate = rowsWithResolvedCategory.map((row) => ({
      title: row.title,
      slug: row.slug,
      price: row.price,
      rating: 5,
      description: row.description ?? "",
      manufacturer: row.manufacturer ?? "",
      mainImage: row.mainImage ?? "",
      categoryId: row.resolvedCategoryId,
      merchantId: resolvedMerchantId,
      inStock: row.inStock,
    }));

    try {
      const createdProducts = await tx.product.createMany({
        data: productsToCreate,
        skipDuplicates: false,
      });

      // Map created products back to rows and create items
      const createdBySlug = new Map();
      const fetchedProducts = await tx.product.findMany({
        where: {
          slug: { in: rowsWithResolvedCategory.map((r) => r.slug) },
        },
        select: { id: true, slug: true },
      });
      
      fetchedProducts.forEach((p) => {
        createdBySlug.set(p.slug, p.id);
      });

      rowsWithResolvedCategory.forEach((row) => {
        const productId = createdBySlug.get(row.slug);
        itemsToCreate.push({
          batchId,
          productId: productId || null,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: row.mainImage,
          categoryId: row.resolvedCategoryId,
          inStock: row.inStock,
          status: productId ? "CREATED" : "ERROR",
          error: productId ? null : truncateError("Product creation failed"),
        });
        if (productId) success++;
        else failed++;
      });
    } catch (e) {
      // Fallback: if batch create fails, mark all as errors
      rowsWithResolvedCategory.forEach((row) => {
        itemsToCreate.push({
          batchId,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: row.mainImage,
          categoryId: row.resolvedCategoryId,
          inStock: row.inStock,
          status: "ERROR",
          error: truncateError(e?.message || "Batch create failed"),
        });
        failed++;
      });
    }
  }

  // Add error rows
  for (const err of errorRows) {
    itemsToCreate.push({
      batchId,
      title: "",
      slug: "",
      price: 0,
      manufacturer: null,
      description: null,
      mainImage: null,
      categoryId: "",
      inStock: 0,
      status: "ERROR",
      error: truncateError(`Row ${err.index}: ${err.error}`),
    });
    failed++;
  }

  // Batch create all items at once (more efficient)
  if (itemsToCreate.length > 0) {
    // Use createMany for better performance, but handle separately if we need individual error handling
    // Since we already collected all items, we can use createMany
    await tx.bulk_upload_item.createMany({
      data: itemsToCreate,
      skipDuplicates: false,
    });
  }

  return { successCount: success, errorCount: failed };
}

async function getBatchSummary(prisma, batchId) {
  const total = await prisma.bulk_upload_item.count({ where: { batchId } });
  const errors = await prisma.bulk_upload_item.count({
    where: { batchId, status: "ERROR" },
  });
  const created = await prisma.bulk_upload_item.count({
    where: { batchId, status: "CREATED" },
  });
  const updated = await prisma.bulk_upload_item.count({
    where: { batchId, status: "UPDATED" },
  });
  return { total, errors, created, updated };
}

async function canDeleteProductsForBatch(prisma, batchId) {
  const items = await prisma.bulk_upload_item.findMany({
    where: { batchId, productId: { not: null } },
    select: { productId: true },
  });
  const productIds = items.map((i) => i.productId).filter(Boolean);

  if (productIds.length === 0) {
    return { canDelete: true, blockedProductIds: [] };
  }

  const referenced = await prisma.customer_order_product.findMany({
    where: { productId: { in: productIds } },
    select: { productId: true },
  });

  const blocked = new Set(referenced.map((r) => r.productId));
  const blockedList = productIds.filter((id) => blocked.has(id));

  if (blockedList.length > 0) {
    return {
      canDelete: false,
      reason: "Some products are in orders",
      blockedProductIds: blockedList,
    };
  }

  return { canDelete: true, blockedProductIds: [] };
}

async function applyItemUpdates(tx, batchId, updates) {
  // updates: [{ itemId, price, inStock }]
  const ids = updates.map((u) => u.itemId);
  const items = await tx.bulk_upload_item.findMany({
    where: { id: { in: ids }, batchId },
    select: { id: true, productId: true },
  });
  const byId = new Map(items.map((i) => [i.id, i]));
  const result = [];

  for (const upd of updates) {
    const current = byId.get(upd.itemId);
    if (!current) continue;

    const price = Math.round(Number(upd.price));
    const inStock = Number(upd.inStock) === 1 ? 1 : 0;

    if (current.productId) {
      await tx.product.update({
        where: { id: current.productId },
        data: { price, inStock },
      });
    }

    const updatedItem = await tx.bulk_upload_item.update({
      where: { id: upd.itemId },
      data: { price, inStock, status: "UPDATED", error: null },
    });
    result.push(updatedItem);
  }
  return result;
}

module.exports = {
  parseCsvBufferToRows,
  validateRow,
  createBatchWithItems,
  computeBatchStatus,
  getBatchSummary,
  canDeleteProductsForBatch,
  applyItemUpdates,
};
