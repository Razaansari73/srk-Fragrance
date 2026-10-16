import { db } from "../config/db.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAdmin = asyncHandler(async (req, _res, next) => {
  const [rows] = await db.query(
    "SELECT role FROM users WHERE id = ? LIMIT 1",
    [req.user?.id]
  );

  if (rows[0]?.role !== "admin") {
    throw new AppError("Admin access required", 403);
  }

  next();
});

