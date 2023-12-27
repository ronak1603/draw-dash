// app/utils/user.server.ts
import bcrypt from "bcryptjs";
import type { RegisterForm } from "./types.server";
import { prisma } from "./db.server";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      userName: user.userName,
      password: passwordHash,
    },
  });
  return { id: newUser.id, userName: user.userName };
};
