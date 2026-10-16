import { db } from "../../config/db.js";

export const findFeaturedProducts = async () => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE is_featured = 1"
  );

  return rows;
};

export const findProductById = async (id) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  return rows[0];
};

export const createProduct = async ({
  name, category, description, price, originalPrice, image, size, stock, isFeatured,
}) => {
  const [result] = await db.query(
    `INSERT INTO products
      (name, category, description, price, original_price, image, size, stock, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, category, description ?? null, price, originalPrice ?? null, image ?? null, size ?? null, stock, isFeatured ? 1 : 0]
  );
  return result.insertId;
};

export const updateProductById = async (id, fields) => {
  const columns = {
    name: "name",
    category: "category",
    description: "description",
    price: "price",
    originalPrice: "original_price",
    image: "image",
    size: "size",
    stock: "stock",
    isFeatured: "is_featured",
  };
  const assignments = [];
  const values = [];

  for (const [field, value] of Object.entries(fields)) {
    assignments.push(`${columns[field]} = ?`);
    values.push(field === "isFeatured" ? (value ? 1 : 0) : value);
  }

  const [result] = await db.query(
    `UPDATE products SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, id]
  );
  return result.affectedRows;
};

export const deleteProductById = async (id) => {
  const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows;
};
