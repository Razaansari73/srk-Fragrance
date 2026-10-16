import { z } from "zod";

const productFields = {
  name: z.string().trim().min(1, "Name is required").max(255),
  category: z.string().trim().min(1, "Category is required").max(100),
  description: z.string().trim().max(65535).nullable().optional(),
  price: z.coerce
    .number()
    .finite()
    .nonnegative("Price cannot be negative")
    .max(99999999.99),
  originalPrice: z.coerce
    .number()
    .finite()
    .nonnegative("Original price cannot be negative")
    .max(99999999.99)
    .nullable()
    .optional(),
  image: z.string().trim().max(500).nullable().optional(),
  size: z.string().trim().max(50).nullable().optional(),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative")
    .default(0),
  isFeatured: z.boolean().default(false),
};

export const createProductSchema = z.object(productFields).strict();

export const updateProductSchema = z
  .object(
    Object.fromEntries(
      Object.entries(productFields).map(([key, schema]) => [
        key,
        schema.optional(),
      ]),
    ),
  )
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one product field is required",
  });
