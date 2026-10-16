import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "node:path";

import authRoutes from "./features/auth/auth.routes.js";
import productRoutes from "./features/products/product.routes.js";

import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.js";

export const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve Uploaded Product Images
app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "SRK Fragrance Backend is running",
  });
});

// Authentication Routes
app.use("/auth", authRoutes);

// Product Routes
app.use("/api/products", productRoutes);

// Error Handlers (Always Last)
app.use(notFoundHandler);
app.use(errorHandler);