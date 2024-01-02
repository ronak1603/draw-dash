import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const kody = await db.user.create({
    data: {
      name: "ronak",
      userName: "kody",
      password: "$2y$10$GcK1J9Zs6D48Fvjx0R0E4eNif/e5WNSayx1AIJHmRutUk6aKNoO8q",
    },
  });
}

seed(); //npx prisma db push //npx prisma db seed //prisma db pull //prisma generate //npx prisma studio
