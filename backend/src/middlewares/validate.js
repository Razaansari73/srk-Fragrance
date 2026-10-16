import { AppError } from "../utils/AppError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          "Validation failed",
          422,
          result.error.issues.map((issue) => ({
            field: issue.path[0],
            message: issue.message,
          }))
        )
      );
    }

    req.body = result.data;

    next();
  };
};
