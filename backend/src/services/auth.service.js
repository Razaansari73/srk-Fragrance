import bcrypt from "bcryptjs";

import {
  createUser,
  findUserByPhone,
} from "../repositories/auth.repository.js";


// ================================
// REGISTER USER
// ================================

export const registerUser = async ({ name, phone, password }) => {

  // 1. Check phone already exists or not
  const existingUser = await findUserByPhone(phone);

  if (existingUser) {
    const error = new Error("Phone number already registered");
    error.statusCode = 409;
    throw error;
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Save user in database
  const result = await createUser({
    name,
    phone,
    password: hashedPassword,
  });

  // 4. Return user (password nahi bhejna)
  return {
    id: result.insertId,
    name,
    phone,
  };
};


// ================================
// LOGIN USER
// ================================

export const loginUser = async ({ phone, password }) => {

  // 1. Find user using phone number
  const user = await findUserByPhone(phone);

  // 2. User nahi mila
  if (!user) {
    const error = new Error("Invalid phone number or password");
    error.statusCode = 401;
    throw error;
  }

  // 3. Entered password ko DB hashed password se compare karo
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  // 4. Password wrong hai
  if (!isPasswordCorrect) {
    const error = new Error("Invalid phone number or password");
    error.statusCode = 401;
    throw error;
  }

  // 5. Login successful
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
  };
};