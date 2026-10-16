import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  createProductService,
  deleteProductService,
  getFeaturedProductsService,
  getProductByIdService,
  updateProductService,
  updateProductImageService,
} from "./product.service.js";

// GET - Featured Products
export const getFeaturedProductsController = asyncHandler(
  async (req, res) => {
    const products = await getFeaturedProductsService();

    res.status(200).json({
      success: true,
      message: "Featured products fetched successfully",
      data: products,
    });
  }
);

// GET - Single Product
export const getProductByIdController = asyncHandler(
  async (req, res) => {
    const product = await getProductByIdService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  }
);

// POST - Create Product
export const createProductController = asyncHandler(
  async (req, res) => {
    const product = await createProductService(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  }
);

// PATCH - Update Product Details
export const updateProductController = asyncHandler(
  async (req, res) => {
    const product = await updateProductService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  }
);

// PATCH - Upload / Update Product Image
export const updateProductImageController = asyncHandler(
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a product image",
      });
    }

    const imagePath = `/uploads/products/${req.file.filename}`;

    const product = await updateProductImageService(
      req.params.id,
      imagePath
    );

    res.status(200).json({
      success: true,
      message: "Product image updated successfully",
      data: product,
    });
  }
);

// DELETE - Delete Product
export const deleteProductController = asyncHandler(
  async (req, res) => {
    await deleteProductService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);