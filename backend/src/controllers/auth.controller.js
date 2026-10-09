import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";

import { signToken } from "../utils/jwt.js";


// ================================
// REGISTER
// ================================

export const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const user = await registerUser({
      name,
      phone,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


// ================================
// LOGIN
// ================================

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await loginUser({
      phone,
      password,
    });

    const token = signToken(user);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


// ================================
// logout
// ================================

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};