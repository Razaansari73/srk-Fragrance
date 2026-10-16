import { asyncHandler } from "../../utils/asyncHandler.js";
import { signToken } from "../../utils/jwt.js";
import { loginUser, registerUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  const token = signToken(user);
  const userType = user.isAdmin ? "admin" : "user";
  
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user , userType },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: { user: req.user },
  });
});
