export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message:
      isProduction && statusCode >= 500
        ? "Something went wrong"
        : error.message || "Something went wrong",
    ...(error.details && { errors: error.details }),
    ...(!isProduction && statusCode >= 500 && { stack: error.stack }),
  });
};
