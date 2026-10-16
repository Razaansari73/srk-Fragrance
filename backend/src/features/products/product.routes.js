import express from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { requireAdmin } from "../../middlewares/requireAdmin.js";
import { uploadProductImage } from "../../middlewares/upload.middleware.js";
import { validate } from "../../middlewares/validate.js";

import {
  createProductController,
  deleteProductController,
  getFeaturedProductsController,
  getProductByIdController,
  updateProductController,
  updateProductImageController,
} from "./product.controller.js";

import {
  createProductSchema,
  updateProductSchema,
} from "./product.validation.js";

const router = express.Router();

// GET - Featured Products
router.get("/", getFeaturedProductsController);

// GET - Single Product
router.get("/:id", getProductByIdController);

// POST - Create Product
router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(createProductSchema),
  createProductController
);

// PATCH - Update Product Details
router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateProductSchema),
  updateProductController
);

// PATCH - Upload / Update Product Image
router.patch(
  "/:id/image",
  authenticate,
  requireAdmin,
  uploadProductImage,
  updateProductImageController
);

// DELETE - Delete Product
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteProductController
);

export default router;