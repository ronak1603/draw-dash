import bcrypt from "bcryptjs";

import { db } from "./db.server";

type LoginForm = {
  password: string;
  userName: string;
};

export async function login({ password, userName }: LoginForm) {
  const user = await db.user.findUnique({
    where: { userName },
  });
  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, userName };
}
