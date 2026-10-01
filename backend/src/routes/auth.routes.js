import express from "express";

import {
  register,
  login,
} from "../controllers/auth.controller.js";

import { validate } from "../middlewares/validate.js";

import { authenticate } from "../middlewares/authenticate.js";

import {
  registerSchema,
  loginSchema,
} from "../schemas/auth.schema.js";

const router = express.Router();

// Register
router.post(
  "/register",
  validate(registerSchema),
  register
);

// Login
router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;