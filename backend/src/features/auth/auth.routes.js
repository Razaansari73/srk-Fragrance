import express from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import { login, logout, me, register } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/session", authenticate, me);
router.get("/profile", authenticate, me);

export default router;
