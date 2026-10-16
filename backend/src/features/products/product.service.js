import { AppError } from "../../utils/AppError.js";

import {
  createProduct,
  deleteProductById,
  findFeaturedProducts,
  findProductById,
  updateProductById,
} from "./product.repository.js";

// Validate Product ID
const productId = (value) => {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new AppError(
      "Product id must be a positive whole number",
      400
    );
  }

  return id;
};

// GET - Featured Products
export const getFeaturedProductsService = async () => {
  const products = await findFeaturedProducts();

  return products;
};

// GET - Single Product
export const getProductByIdService = async (id) => {
  const product = await findProductById(productId(id));

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// POST - Create Product
export const createProductService = async (data) => {
  const id = await createProduct(data);

  return getProductByIdService(id);
};

// PATCH - Update Product Details
export const updateProductService = async (id, data) => {
  const normalizedId = productId(id);

  await getProductByIdService(normalizedId);

  await updateProductById(normalizedId, data);

  return getProductByIdService(normalizedId);
};

// PATCH - Update Product Image
export const updateProductImageService = async (id, imagePath) => {
  const normalizedId = productId(id);

  // Check product exists
  await getProductByIdService(normalizedId);

  // Update image path in MySQL
  await updateProductById(normalizedId, {
    image: imagePath,
  });

  // Return updated product
  return getProductByIdService(normalizedId);
};

// DELETE - Delete Product
export const deleteProductService = async (id) => {
  const normalizedId = productId(id);

  await getProductByIdService(normalizedId);

  await deleteProductById(normalizedId);
};