import bcrypt from "bcryptjs";

import { AppError } from "../../utils/AppError.js";
import { createUser, findUserByPhone } from "./auth.repository.js";

export const registerUser = async ({ name, phone, password }) => {
  const existingUser = await findUserByPhone(phone);

  if (existingUser) {
    throw new AppError("Phone number already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await createUser({
    name,
    phone,
    password: hashedPassword,
  });

  return {
    id: result.insertId,
    name,
    phone,
  };
};

export const loginUser = async ({ phone, password }) => {
  const user = await findUserByPhone(phone);

  if (!user) {
    throw new AppError("Invalid phone number or password", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid phone number or password", 401);
  }

  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
};
