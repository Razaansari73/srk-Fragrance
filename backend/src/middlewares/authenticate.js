import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new AppError("Token not provided", 401);
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();

  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError("Invalid or expired token", 401)
    );
  }
};
