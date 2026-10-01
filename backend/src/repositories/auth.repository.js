import { db } from "../config/db.js";

export const findUserByPhone = async (phone) => {
  const [rows] = await db.query(
    `SELECT id, name, phone, password
     FROM users
     WHERE phone = ?
     LIMIT 1`,
    [phone]
  );

  return rows[0];
};

export const createUser = async ({ name, phone, password }) => {
  const [result] = await db.query(
    `INSERT INTO users (name, phone, password)
     VALUES (?, ?, ?)`,
    [name, phone, password]
  );

  return result;
};