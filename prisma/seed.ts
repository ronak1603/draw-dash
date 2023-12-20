import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getJokes().map((user) => {
      console.log("ronak");
      return db.user.create({ data: user });
    })
  );
}

seed();

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Road worker",
      userName: `ronak_1`,
      password: "test@123",
    },
    {
      name: "Frisbee",
      userName: `ronak_2`,
      password: "test@123",
    },
    {
      name: "Trees",
      userName: `ronak_3`,
      password: "test@123",
    },
    {
      name: "Skeletons",
      userName: `ronak_4`,
      password: "test@123",
    },
  ];
}
